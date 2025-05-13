import express from "express";
import { register, login, getCurrentUser, checkEmail, forgetPassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { avatarStorage} from "../utils/cloudinary.js";
import multer from "multer";


export const uploadAvatar = multer({ storage: avatarStorage }); 

const router = express.Router();

router.post("/register", uploadAvatar.single("avatar"), register);
router.post("/login", login);
router.get("/check-email", checkEmail);
router.put("/reset-password", forgetPassword)


router.get("/me", verifyToken, getCurrentUser);

export default router;
