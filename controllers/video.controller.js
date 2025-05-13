import mongoose from "mongoose";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

/**
 * @function getAllVideos
 * @description Fetch all videos from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response with all videos.
 */
export const getAllVideos = async (req, res) => {
  const videos = await Video.find()
    .populate("uploader")
    .populate("comments.userId", "username avatar");
  res.json(videos);
};

/**
 * @function getVideoById
 * @description Fetch a specific video by its ID.
 * @param {Object} req - The request object, containing the video ID as a parameter.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response with the video details.
 */

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId })
      .populate("channelId") // populate the channel data
      .populate("uploader", "username avatar")
      .populate("comments.userId", "username avatar")
      .exec();
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @function uploadVideo
 * @description Upload a new video to the platform.
 * @param {Object} req - The request object containing video data and files.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response with the saved video object.
 */

export const uploadVideo = async (req, res) => {
  try {
    const { title, description, channelId } = req.body;
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    // Create a new video document
    const video = new Video({
      videoId: uuidv4(),
      title,
      description,
      uploader: req.user.id,
      videoUrl: `http://localhost:5000/${videoFile.path}`,
      thumbnailUrl: thumbnailFile
        ? `http://localhost:5000/${thumbnailFile.path}`
        : "",
      uploadDate: new Date(),
      views: [],
      likes: [],
      dislikes: [],
      channelId,
      comments: [],
      category: "uploaded",
    });

    // Save the video and capture the saved video object
    const savedVideo = await video.save();

    // If a channelId is provided, update the channel with the new video ID
    if (channelId) {
      const channel = await Channel.findOne({ channelId });
      if (channel) {
        channel.videos.push(savedVideo._id); // Use savedVideo._id now
        await channel.save();
      }
    }

    // Respond with the saved video
    res.status(201).json(savedVideo); // Send the saved video object in the response
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ message: "Failed to upload video" });
  }
};

/**
 * @function likeVideo
 * @description Toggle the like status of a video (like/dislike).
 * @param {Object} req - The request object containing video ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response with updated like/dislike counts.
 */

export const likeVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.user.id;
    const objectUserId = mongoose.Types.ObjectId.createFromHexString(userId);

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const hasLiked = video.likes.includes(objectUserId);
    const hasDisliked = video.dislikes.includes(objectUserId);

    // If user already liked, remove like
    if (hasLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      if (hasDisliked) video.dislikes.pull(userId); // Remove dislike if exists
    }

    await video.save();

    // Update the user’s likedVideos array
    const user = await User.findById(userId); // Find the user by ID
    if (!user) return res.status(404).json({ message: "User not found" });

    // If the user liked the video, add it to the likedVideos array, else remove it
    if (hasLiked) {
      user.likedVideos.pull(videoId); // Remove like
    } else {
      if (!user.likedVideos.includes(videoId)) {
        user.likedVideos.push(videoId); // Add only if not already present
      }
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      likes: video.likes,
      dislikes: video.dislikes,
      message: "Like status updated",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @function dislikeVideo
 * @description Toggle the dislike status of a video (dislike/undislike).
 * @param {Object} req - The request object containing video ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response with updated like/dislike counts.
 */

export const dislikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const objectUserId = mongoose.Types.ObjectId.createFromHexString(userId);

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const hasDisliked = video.dislikes.includes(objectUserId);
    const hasLiked = video.likes.includes(objectUserId);

    if (hasDisliked) {
      // Remove dislike (toggle off)
      video.dislikes.pull(userId);
    } else {
      // Add dislike
      video.dislikes.push(userId);
      // Also remove from likes if present
      if (hasLiked) {
        video.likes.pull(userId);
      }
    }

    await video.save();

    res.status(200).json({
      message: hasDisliked ? "Dislike removed" : "Disliked",
      likes: video.likes,
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error("Error toggling dislike:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @function addView
 * @description Add a view to a video.
 * @param {Object} req - The request object containing video ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response confirming the view addition.
 */

export const addView = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findOne({ videoId });

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (!video.views.includes(userId)) {
      video.views.push(userId);
      await video.save();
    }

    res.status(200).json({
      message: "View recorded",
      viewsCount: video.views.length,
    });
  } catch (err) {
    console.error("Error adding view:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @function addToHistory
 * @description Add a video to the user's watch history.
 * @param {Object} req - The request object containing video ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response confirming the history update.
 */

export const addToHistory = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;

    // Ensure the user is authenticated and exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's history safely using findOneAndUpdate with $addToSet to avoid duplicates
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: { history: videoId },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(500)
        .json({ message: "Failed to update user's history" });
    }
    await Video.findByIdAndUpdate(videoId, { updatedAt: new Date() });

    res.status(200).json({
      message: "Video added to history",
      history: updatedUser.history,
    });
  } catch (err) {
    console.error("Error adding to history", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @function toggleWatchLater
 * @description Add or remove a video from the user's watch later list.
 * @param {Object} req - The request object containing video ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response with the updated watch later list.
 */

export const toggleWatchLater = async (req, res) => {
  try {
    const videoId = req.params.id;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.watchLater.indexOf(videoId);
    if (index > -1) {
      user.watchLater.splice(index, 1);
      await user.save();
      return res.status(200).json({
        message: "Removed from watch later",
        watchLater: user.watchLater,
      });
    } else {
      user.watchLater.push(videoId);
      await user.save();
      return res
        .status(200)
        .json({ message: "Added to watch later", watchLater: user.watchLater });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @function deleteVideo
 * @description Delete a video from the platform.
 * @param {Object} req - The request object containing video ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response confirming the deletion.
 */

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await video.deleteOne();
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @function updateVideo
 * @description Update a video's details (title/description).
 * @param {Object} req - The request object containing video ID and new details.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Returns a JSON response with the updated video.
 */

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description } = req.body;
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;

    await video.save();
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
