import express from "express";
import multer from "multer";
import path from "path";
import {
  createChannel,
  deleteChannel,
  getAllChannels,
  getChannel,
  getMyChannels,
  getSubscribedChannels,
  subscribeChannel,
  unsubscribeChannel,
  updateChannel,
} from "../controllers/channel.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { channelStorage } from "../utils/cloudinary.js";

const upload = multer({ storage: channelStorage });

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  upload.fields([
    { name: "channelBanner", maxCount: 1 },
    { name: "channelImage", maxCount: 1 },
  ]),
  createChannel
);
router.get("/all", verifyToken, getAllChannels);
router.get("/:channelId", getChannel);
router.put(
  "/:channelId",
  verifyToken,
  upload.fields([
    { name: "channelBanner", maxCount: 1 },
    { name: "channelImage", maxCount: 1 },
  ]),
  updateChannel
);
router.delete("/:channelId", verifyToken, deleteChannel);
router.put("/subscribe/:channelId", verifyToken, subscribeChannel);
router.put("/unsubscribe/:channelId", verifyToken, unsubscribeChannel);
router.get("/my-channels", verifyToken, getMyChannels);
router.get("/subscriptions/me", verifyToken, getSubscribedChannels);

export default router;
