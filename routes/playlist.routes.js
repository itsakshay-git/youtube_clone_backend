import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createPlaylist);
router.get("/user/:userId", verifyToken, getAllPlaylist);
router.put("/:playlistId/add-video", verifyToken, addVideoToPlaylist);
router.put("/:playlistId/remove-video", verifyToken, removeVideoFromPlaylist);
router.delete("/:playlistId", verifyToken, deletePlaylist);
router.put("/:playlistId", verifyToken, updatePlaylist);

export default router;
