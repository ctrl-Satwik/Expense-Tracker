const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: { type: String, default: null },

        // Email verification (accounts created before this existed are
        // marked verified on startup - see config/db.js)
        isEmailVerified: { type: Boolean, default: false },
        emailVerificationToken: { type: String, select: false },
        emailVerificationExpire: { type: Date, select: false },

        // Password reset - only the SHA-256 hash of the token is stored
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpire: { type: Date, select: false },

        // JWTs issued before this time are rejected (set on password reset)
        passwordChangedAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: {
            // Never send secrets back to the client
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.emailVerificationToken;
                delete ret.emailVerificationExpire;
                delete ret.resetPasswordToken;
                delete ret.resetPasswordExpire;
                delete ret.passwordChangedAt;
                return ret;
            },
        },
    }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);

});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
