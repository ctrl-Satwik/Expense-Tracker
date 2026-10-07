const cloudinary = require("cloudinary").v2;

let configured = false;

const configure = () => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary is not configured");
    }
    if (!configured) {
        cloudinary.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            secure: true,
        });
        configured = true;
    }
};

// Upload an in-memory image buffer (from multer.memoryStorage) and return its HTTPS URL
const uploadImageBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        configure();
        const stream = cloudinary.uploader.upload_stream(
            { folder: "expense-tracker/profile-images", resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

module.exports = { uploadImageBuffer };
