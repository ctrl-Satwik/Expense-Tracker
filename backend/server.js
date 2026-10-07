require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { getAllowedOrigins } = require("./utils/clientUrl");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

// Render sits behind one proxy hop - needed so rate limiting sees the real client IP
app.set("trust proxy", 1);

// Middleware to handle CORS
const allowedOrigins = getAllowedOrigins();
if (allowedOrigins.length === 0) {
    console.warn("CLIENT_URL is not set - CORS allows all origins and email links cannot be built");
}

app.use(
    cors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve legacy profile images uploaded before the move to Cloudinary
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

// Start accepting requests only once the DB (and legacy-user migration) is ready
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
