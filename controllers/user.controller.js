import User from "../models/User.js";

/**
 * Sets a default channel for the user.
 *
 * @route POST /api/user/default-channel
 * @param {object} req - The request object containing `id` of the channel to be set as default in the body.
 * @param {object} res - The response object, which returns the updated user information.
 * @returns {object} - The updated user object with the newly set default channel.
 * @throws {500} - If there is an error during the process.
 */

export const setDefaultChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { defaultChannel: id }, // << channelId is UUID now
      { new: true }
    ).populate("channels");

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to set default channel", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Retrieves the user's video history with deduplication based on video ID.
 *
 * @route GET /api/user/history
 * @param {object} req - The request object, containing user authentication information.
 * @param {object} res - The response object, which returns the user's unique history of videos.
 * @returns {object} - An object containing an array of unique video history.
 * @throws {500} - If there is an error while fetching the user's history.
 */

export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("history");

    // Deduplicate based on video ID
    const uniqueHistoryMap = new Map();
    user.history.forEach((video) => {
      uniqueHistoryMap.set(video._id.toString(), video);
    });

    const uniqueHistory = Array.from(uniqueHistoryMap.values());

    res.status(200).json({ history: uniqueHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Retrieves the user's liked videos.
 *
 * @route GET /api/user/liked-videos
 * @param {object} req - The request object containing user authentication information.
 * @param {object} res - The response object, which returns an array of liked videos.
 * @returns {object} - An object containing an array of liked videos.
 * @throws {500} - If there is an error while fetching the liked videos.
 */

export const getLikedVideos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("likedVideos");
    res.status(200).json({ liked: user.likedVideos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Retrieves the user's "Watch Later" videos.
 *
 * @route GET /api/user/watch-later
 * @param {object} req - The request object containing user authentication information.
 * @param {object} res - The response object, which returns an array of "Watch Later" videos.
 * @returns {object} - An object containing an array of watch later videos.
 * @throws {500} - If there is an error while fetching the watch later videos.
 */

export const getWatchLater = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("watchLater");
    res.status(200).json({ watchLater: user.watchLater });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { history: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "History cleared", history: user.history });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.videoId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove the videoId from the history array
    user.history = user.history.filter((video) => video.toString() !== videoId);

    await user.save();

    res.status(200).json({ message: "Video removed from history" });
  } catch (err) {
    console.error("Error removing video from history:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteLikedVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { liked: videoId } },
      { new: true }
    );

    res.status(200).json({
      message: "Video removed from liked list",
      liked: updatedUser.liked,
    });
  } catch (error) {
    console.error("Error removing liked video:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeFromWatchLater = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchLater = user.watchLater.filter((id) => id.toString() !== videoId);

    await user.save();
    res.status(200).json({ message: "Removed from Watch Later" });
  } catch (error) {
    console.error("Error removing from watch later:", error);
    res.status(500).json({ message: "Server error" });
  }
};
