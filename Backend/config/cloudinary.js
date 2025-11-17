// Backend/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary once globally
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return uploadResult; // has .url, .secure_url, .public_id
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return null;
  }
};

export { uploadOnCloudinary };
