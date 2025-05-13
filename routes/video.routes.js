import express from "express";
import {
  getAllVideos,
  getVideoById,
  uploadVideo,
  dislikeVideo,
  likeVideo,
  addView,
  addToHistory,
  toggleWatchLater,
  deleteVideo,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadFields } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);
router.post("/upload", verifyToken, uploadFields, uploadVideo);
router.put("/like/:videoId", verifyToken, likeVideo);
router.put("/dislike/:videoId", verifyToken, dislikeVideo);
router.post("/:videoId/view", verifyToken, addView);

router.put("/history/:id", verifyToken, addToHistory);
router.put("/watch-later/:id", verifyToken, toggleWatchLater);

router.delete("/:videoId", verifyToken, deleteVideo);
router.put("/:videoId", verifyToken, updateVideo);

export default router;
