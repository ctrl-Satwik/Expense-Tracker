const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected");
        await markLegacyUsersVerified();
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
};

// Accounts created before email verification was introduced have no
// isEmailVerified field at all. Treat them as verified so they aren't locked
// out. New accounts always store the field explicitly, so this is idempotent.
const markLegacyUsersVerified = async () => {
    const User = require("../models/User");
    const result = await User.updateMany(
        { isEmailVerified: { $exists: false } },
        { $set: { isEmailVerified: true } }
    );
    if (result.modifiedCount > 0) {
        console.log(`Marked ${result.modifiedCount} existing user(s) as email-verified`);
    }
};

module.exports = connectDB;
