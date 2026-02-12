import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been successfully uploaded
    console.log("File has been successfully uploaded:", response.url);
    return { url: response.url, publicId: response.public_id };
  } catch (error) {
    // INFO : removes the locally saved temp file if the upload fails
    return null;
  } finally {
    fs.unlinkSync(localFilePath);
  }
};
