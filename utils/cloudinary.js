import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_avatars",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 300, height: 300, crop: "thumb", gravity: "face" },
    ],
  },
});

const channelStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "channel_banners",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 1280, height: 720, crop: "limit" }],
  },
});

export { cloudinary, avatarStorage, channelStorage };
