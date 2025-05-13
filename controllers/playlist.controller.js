import mongoose from "mongoose";
import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

/**
 * @function createPlaylist
 * @description Creates a new playlist or adds a video to an existing playlist.
 * @route POST /api/playlists
 * @access Private (requires authentication middleware to attach req.user)
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request body
 * @param {string} req.body.name - The name of the playlist
 * @param {string} req.body.videoId - The ID of the video to be added to the playlist
 * @param {string} req.body.userId - The ID of the user creating the playlist
 * @param {boolean} [req.body.isPrivate=false] - The privacy setting of the playlist (optional)
 * @param {Object} req.user - Authenticated user object attached by middleware
 * @param {string} req.user.id - ID of the authenticated user
 *
 * @param {Object} res - Express response object
 * @returns {Array} Updated list of playlists for the user
 */

export const createPlaylist = async (req, res) => {
  const { name, videoId, userId, isPrivate = false } = req.body;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(videoId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: "Invalid videoId or userId" });
  }

  try {
    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Find or create the playlist
    let playlist = await Playlist.findOne({ name, userId });

    if (playlist) {
      // Add video to the playlist if not already included
      if (!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId);
        await playlist.save();
      }
    } else {
      // Create a new playlist
      playlist = new Playlist({
        name,
        userId,
        videos: [videoId],
        isPrivate,
      });
      await playlist.save();
    }

    // Update the user's playlist references and fetch updated user with populated playlists
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { playlists: playlist._id } },
      { new: true }
    ).populate({
      path: "playlists",
      populate: {
        path: "videos",
        select: "title videoId",
      },
    });

    return res.status(201).json(updatedUser.playlists);
  } catch (error) {
    console.error("Error creating or updating playlist:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating playlist" });
  }
};

/**
 * @function getAllPlaylist
 * @description Fetches all playlists for a user.
 * @route GET /api/playlists/:userId
 * @access Private (requires authentication middleware to attach req.user)
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - The ID of the user whose playlists are being fetched
 *
 * @param {Object} res - Express response object
 * @returns {Array} List of playlists for the user
 */

export const getAllPlaylist = async (req, res) => {
  const { userId } = req.params;

  try {
    const playlists = await Playlist.find({ userId }).populate("videos");
    res.status(200).json(playlists);
  } catch (err) {
    console.error("Error fetching playlists:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @function addVideoToPlaylist
 * @description Adds a video to an existing playlist.
 * @route PUT /api/playlists/:playlistId
 * @access Private (requires authentication middleware to attach req.user)
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.playlistId - The ID of the playlist to add the video to
 * @param {Object} req.body - The request body
 * @param {string} req.body.videoId - The ID of the video to add
 *
 * @param {Object} res - Express response object
 * @returns {Object} Updated playlist with the newly added video
 */

export const addVideoToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { videoId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return res.status(400).json({ message: "Invalid playlistId or videoId" });
  }

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }

    const updatedPlaylist = await Playlist.findById(playlistId).populate(
      "videos"
    );
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.error("Error adding video to playlist:", error);
    res
      .status(500)
      .json({ message: "Server error while adding video to playlist" });
  }
};

/**
 * @function removeVideoFromPlaylist
 * @description Removes a video from an existing playlist.
 * @route DELETE /api/playlists/:playlistId
 * @access Private (requires authentication middleware to attach req.user)
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.playlistId - The ID of the playlist to remove the video from
 * @param {Object} req.body - The request body
 * @param {string} req.body.videoId - The ID of the video to remove
 *
 * @param {Object} res - Express response object
 * @returns {Object} Updated playlist with the video removed
 */

export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { videoId } = req.body;

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { videos: videoId } },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @function deletePlaylist
 * @description Deletes a playlist.
 * @route DELETE /api/playlists/:playlistId
 * @access Private (requires authentication middleware to attach req.user)
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.playlistId - The ID of the playlist to delete
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - ID of the authenticated user
 *
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */

export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist)
      return res.status(404).json({ message: "Playlist not found" });

    if (playlist.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await playlist.deleteOne();
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @function updatePlaylist
 * @description Updates a playlist's name or privacy setting.
 * @route PUT /api/playlists/:playlistId
 * @access Private (requires authentication middleware to attach req.user)
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.playlistId - The ID of the playlist to update
 * @param {Object} req.body - The request body
 * @param {string} [req.body.name] - The new name of the playlist (optional)
 * @param {boolean} [req.body.isPrivate] - The new privacy setting (optional)
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - ID of the authenticated user
 *
 * @param {Object} res - Express response object
 * @returns {Object} Updated playlist
 */

export const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow updating specific fields
    const { name, isPrivate } = req.body;
    if (name !== undefined) playlist.name = name;
    if (isPrivate !== undefined) playlist.isPrivate = isPrivate;

    await playlist.save();
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
