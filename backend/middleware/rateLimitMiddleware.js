const { rateLimit } = require("express-rate-limit");

// Per-IP limits for the public auth endpoints. Requires app.set("trust proxy", 1)
// so the client IP is read from Render's proxy header.
const createLimiter = (limit, windowMinutes) =>
    rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        limit,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: { message: "Too many requests. Please try again later." },
    });

module.exports = {
    loginLimiter: createLimiter(20, 15),
    registerLimiter: createLimiter(10, 60),
    forgotPasswordLimiter: createLimiter(5, 15),
    resetPasswordLimiter: createLimiter(10, 15),
    verifyEmailLimiter: createLimiter(20, 15),
    resendVerificationLimiter: createLimiter(5, 15),
};
