import express from "express";
import {
  clearHistory,
  deleteLikedVideo,
  getHistory,
  getLikedVideos,
  getWatchLater,
  removeFromHistory,
  removeFromWatchLater,
  setDefaultChannel,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/set-default-channel", verifyToken, setDefaultChannel);
router.get("/history", verifyToken, getHistory);
router.get("/liked", verifyToken, getLikedVideos);
router.get("/watch-later", verifyToken, getWatchLater);
router.delete("/history", verifyToken, clearHistory);
router.delete("/history/:videoId", verifyToken, removeFromHistory);
router.delete("/liked/:videoId", verifyToken, deleteLikedVideo);
router.delete("/watch-later/:videoId", verifyToken, removeFromWatchLater);

export default router;
