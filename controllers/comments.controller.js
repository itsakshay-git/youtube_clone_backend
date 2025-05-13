import Video from "../models/Video.js";
import { v4 as uuidv4 } from "uuid";


/**
 * @function addComment
 * @description Adds a new comment to a video.
 * @route POST /api/comments/:id
 * @access Private (requires authentication middleware to attach req.user)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The `videoId` of the video to which the comment is being added
 * @param {Object} req.body - The request body
 * @param {string} req.body.text - The text content of the comment
 * @param {Object} req.user - Authenticated user object attached by middleware
 * @param {string} req.user.id - ID of the authenticated user
 * 
 * @param {Object} res - Express response object
 * @returns {Object} Updated list of comments on the video
 */

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = {
      commentId: uuidv4(),
      userId: req.user.id,
      text,
      timestamp: new Date(),
    };

    const video = await Video.findOneAndUpdate(
      { videoId: req.params.id },
      { $push: { comments: comment } },
      { new: true }
    );

    res.status(201).json(video.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @function deleteComment
 * @description Deletes a comment from a video if the requesting user is the comment's owner.
 * @route DELETE /api/comments/:videoId/:commentId
 * @access Private (requires authentication middleware to attach req.user)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.videoId - ID of the video containing the comment
 * @param {string} req.params.commentId - ID of the comment to delete
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - ID of the authenticated user
 * 
 * @param {Object} res - Express response object
 * @returns {Object} Updated list of comments on the video
 */

export const deleteComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.find((c) => c.commentId === commentId);

    if (!comment || comment.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    video.comments = video.comments.filter((c) => c.commentId !== commentId);
    await video.save();
    res.status(200).json(video.comments);
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: err.message });
  }
};