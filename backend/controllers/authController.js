const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createToken, hashToken } = require("../utils/tokens");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/emailService");
const { uploadImageBuffer } = require("../utils/cloudinary");

const MIN_PASSWORD_LENGTH = 8;
const VERIFICATION_TOKEN_TTL = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TOKEN_TTL = 10 * 60 * 1000; // 10 minutes

const FORGOT_PASSWORD_MESSAGE =
    "If an account exists for this email, a password reset link has been sent.";
const RESEND_VERIFICATION_MESSAGE =
    "If an unverified account exists for this email, a new verification link has been sent.";

// Compared against when the email is unknown, so login takes the same time either way
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("dummy-password-for-timing", 10);

const isValidEmail = (email) =>
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) =>
    typeof password === "string" && password.length >= MIN_PASSWORD_LENGTH;

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Create a fresh verification token for the user and email the link
const issueVerificationEmail = async (user) => {
    const { rawToken, hashedToken, expiresAt } = createToken(VERIFICATION_TOKEN_TTL);
    await User.updateOne(
        { _id: user._id },
        { $set: { emailVerificationToken: hashedToken, emailVerificationExpire: expiresAt } }
    );
    await sendVerificationEmail(user, rawToken);
};

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

    // Validation: Check for missing fields
    if (typeof fullName !== "string" || !fullName.trim() || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Optional profile photo, sent as multipart field "image"
        let profileImageUrl = null;
        if (req.file) {
            try {
                profileImageUrl = await uploadImageBuffer(req.file.buffer);
            } catch (err) {
                console.error("Profile image upload failed:", err.message);
                return res.status(500).json({
                    message: "Could not upload profile image. Please try again.",
                });
            }
        }

        // Create the user
        const user = await User.create({
            fullName: fullName.trim(),
            email,
            password,
            profileImageUrl,
            isEmailVerified: false,
        });

        let emailSent = true;
        try {
            await issueVerificationEmail(user);
        } catch (err) {
            emailSent = false;
            console.error("Verification email failed:", err.message);
        }

        res.status(201).json({
            message: emailSent
                ? "Account created. Please check your email to verify your account."
                : "Account created, but we couldn't send the verification email. Please use \"Resend verification email\" on the login page.",
            emailSent,
        });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user" });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

    if (!email || typeof password !== "string" || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });

        const passwordMatches = user
            ? await user.comparePassword(password)
            : await bcrypt.compare(password, DUMMY_PASSWORD_HASH);

        if (!user || !passwordMatches) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (user.isEmailVerified === false) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                code: "EMAIL_NOT_VERIFIED",
            });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error Logging user" });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const hashedToken = hashToken(req.params.token);

    try {
        // Atomic find-and-clear, so a token can only ever be used once
        const user = await User.findOneAndUpdate(
            {
                emailVerificationToken: hashedToken,
                emailVerificationExpire: { $gt: new Date() },
            },
            {
                $set: { isEmailVerified: true },
                $unset: { emailVerificationToken: 1, emailVerificationExpire: 1 },
            }
        );

        if (!user) {
            const expired = await User.exists({ emailVerificationToken: hashedToken });
            return res.status(400).json(
                expired
                    ? { message: "This verification link has expired. Please request a new one.", code: "TOKEN_EXPIRED" }
                    : { message: "This verification link is invalid or has already been used.", code: "TOKEN_INVALID" }
            );
        }

        res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (err) {
        res.status(500).json({ message: "Error verifying email" });
    }
};

// Resend Verification Email
exports.resendVerification = async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
    }

    try {
        const user = await User.findOne({ email });

        // Same response whether or not the account exists / is verified
        res.status(200).json({ message: RESEND_VERIFICATION_MESSAGE });

        if (user && user.isEmailVerified === false) {
            issueVerificationEmail(user).catch((err) =>
                console.error("Verification email failed:", err.message)
            );
        }
    } catch (err) {
        res.status(500).json({ message: "Error sending verification email" });
    }
};

// getUserInfo
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user" });
    }
};

// Update User Info
exports.updateUserInfo = async (req, res) => {
    const { fullName, profileImageUrl } = req.body;

    // Validation: Check for missing fields
    if (typeof fullName !== "string" || !fullName.trim()) {
        return res.status(400).json({ message: "Full Name is required" });
    }

    if (profileImageUrl != null && profileImageUrl !== "" &&
        (typeof profileImageUrl !== "string" || !/^https?:\/\//.test(profileImageUrl))) {
        return res.status(400).json({ message: "Invalid profile image URL" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = fullName.trim();
        user.profileImageUrl = profileImageUrl || null;

        await user.save();

        res.status(200).json({
            id: user._id,
            user,
            message: "Profile updated successfully",
        });

    } catch (err) {
        res
            .status(500)
            .json({ message: "Error updating user info" });
    }
}

// Upload Profile Image (authenticated) - returns a Cloudinary URL
exports.uploadProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    try {
        const imageUrl = await uploadImageBuffer(req.file.buffer);
        res.status(200).json({ imageUrl });
    } catch (err) {
        console.error("Profile image upload failed:", err.message);
        res.status(500).json({ message: "Image upload failed" });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            const { rawToken, hashedToken, expiresAt } = createToken(RESET_TOKEN_TTL);
            await User.updateOne(
                { _id: user._id },
                { $set: { resetPasswordToken: hashedToken, resetPasswordExpire: expiresAt } }
            );

            // Sent after responding so response time doesn't reveal whether the account exists
            res.status(200).json({ message: FORGOT_PASSWORD_MESSAGE });
            sendPasswordResetEmail(user, rawToken).catch((err) =>
                console.error("Password reset email failed:", err.message)
            );
            return;
        }

        res.status(200).json({ message: FORGOT_PASSWORD_MESSAGE });
    } catch (err) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({ message: "Error sending reset link" });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { password } = req.body;

    if (!isValidPassword(password)) {
        return res.status(400).json({
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        });
    }

    const hashedToken = hashToken(req.params.token);

    try {
        // Atomic find-and-clear, so a token can only ever be used once
        const user = await User.findOneAndUpdate(
            {
                resetPasswordToken: hashedToken,
                resetPasswordExpire: { $gt: new Date() },
            },
            {
                $unset: {
                    resetPasswordToken: 1,
                    resetPasswordExpire: 1,
                    emailVerificationToken: 1,
                    emailVerificationExpire: 1,
                },
            }
        );

        if (!user) {
            const expired = await User.exists({ resetPasswordToken: hashedToken });
            return res.status(400).json(
                expired
                    ? { message: "This reset link has expired. Please request a new one.", code: "TOKEN_EXPIRED" }
                    : { message: "This reset link is invalid or has already been used.", code: "TOKEN_INVALID" }
            );
        }

        user.password = password; // Hashed by the pre-save hook
        user.isEmailVerified = true; // Receiving the reset email proves ownership
        user.passwordChangedAt = new Date(Date.now() - 1000); // Invalidates older JWTs
        await user.save();

        res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });

    } catch (err) {
        res.status(500).json({ message: "Error resetting password" });
    }
};
