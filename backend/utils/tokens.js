const crypto = require("crypto");

// Hash a raw token for storage/lookup - the raw value is only ever emailed
const hashToken = (rawToken) =>
    crypto.createHash("sha256").update(String(rawToken)).digest("hex");

// Generate a single-use token: the raw value goes in the email link,
// the hash goes in the database
const createToken = (ttlMs) => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    return {
        rawToken,
        hashedToken: hashToken(rawToken),
        expiresAt: new Date(Date.now() + ttlMs),
    };
};

module.exports = { hashToken, createToken };
