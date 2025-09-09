import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const connectCloudinary = () => {
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
};

// Upload file to Cloudinary and remove local file
export const uploadToCloudinary = async (filePath, folder = "eduzap") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // delete local file after upload
    return result.secure_url; // return URL to save in DB
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

export default connectCloudinary;