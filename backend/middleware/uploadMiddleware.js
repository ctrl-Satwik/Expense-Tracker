const multer = require("multer");

// Keep uploads in memory and forward them to Cloudinary -
// Render's local disk is wiped on every deploy/restart
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Wraps upload.single() so multer errors become 400 JSON responses
const singleImage = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (!err) return next();
        const message =
            err.code === "LIMIT_FILE_SIZE"
                ? "Image must be 5 MB or smaller"
                : err.message === "Invalid file type"
                    ? "Only JPEG and PNG images are allowed"
                    : "Image upload failed";
        return res.status(400).json({ message });
    });
};

module.exports = { upload, singleImage };
