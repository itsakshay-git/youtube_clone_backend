import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addComment, deleteComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/:id/comments", verifyToken, addComment);
router.delete("/:videoId/comments/:commentId", verifyToken, deleteComment);

export default router;