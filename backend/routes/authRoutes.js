const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,
    getUserInfo,
    updateUserInfo,
    uploadProfileImage,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");
const { singleImage } = require("../middleware/uploadMiddleware");
const {
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter,
    verifyEmailLimiter,
    resendVerificationLimiter,
} = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// Register accepts JSON or multipart (with an optional "image" profile photo)
router.post("/register", registerLimiter, singleImage("image"), registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/verify-email/:token", verifyEmailLimiter, verifyEmail);
router.post("/resend-verification", resendVerificationLimiter, resendVerification);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPasswordLimiter, resetPassword);

router.get("/getUser", protect, getUserInfo);
router.put("/update-user", protect, updateUserInfo);
router.post("/upload-image", protect, singleImage("image"), uploadProfileImage);

module.exports = router;
