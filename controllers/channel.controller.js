import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";

/**
 * Create a new channel and associate it with the current user.
 * @route POST /api/channels
 * @access Private
 * @param {Object} req - Express request object (expects req.user and req.body)
 * @param {Object} res - Express response object
 * @returns {Object} JSON containing the saved channel
 */

export const createChannel = async (req, res) => {
  try {
    const { channelName, handle } = req.body;
    const userId = req.user.id;

    // 1. Create the channel
    const newChannel = new Channel({
      channelId: uuidv4(),
      channelName,
      handle,
      channelBanner: req.files?.channelBanner?.[0]?.path,
      channelImage: req.files?.channelImage?.[0]?.path,
      owner: userId,
      videos: [],
    });

    const savedChannel = await newChannel.save();

    // 2. Find user to check channels count
    const user = await User.findById(userId);

    // 3. Add the new channel to user's channels list
    user.channels.push(savedChannel._id);

    // 4. If this is the first channel, set it as default
    if (!user.defaultChannel) {
      user.defaultChannel = savedChannel.channelId;
    }

    await user.save();

    res.status(201).json(savedChannel);
  } catch (err) {
    console.error("Error creating channel:", err);
    res.status(500).json({ message: "Failed to create channel." });
  }
};

/**
 * Retrieve a channel and its associated videos by channelId.
 * @route GET /api/channels/:channelId
 * @access Public
 * @param {Object} req - Express request object (expects req.params.channelId)
 * @param {Object} res - Express response object
 * @returns {Object} JSON containing channel data
 */

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      channelId: req.params.channelId,
    }).populate("videos");
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update an existing channel's name, description, or media.
 * @route PUT /api/channels/:channelId
 * @access Private
 * @param {Object} req - Express request object (expects req.params.channelId, req.body, req.files)
 * @param {Object} res - Express response object
 * @returns {Object} JSON containing updated channel and user
 */

export const updateChannel = async (req, res) => {
  try {
    const { channelName, description } = req.body;
    const channelId = req.params.channelId;

    const channel = await Channel.findOne({ channelId });
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channelName) channel.channelName = channelName;
    if (description) channel.description = description;

    if (req.files?.channelBanner) {
      channel.channelBanner = req.files.channelBanner[0].path;
    }

    if (req.files?.channelImage) {
      channel.channelImage = req.files.channelImage[0].path;
    }

    await channel.save();

    const updatedUser = await User.findById(channel.owner).populate("channels");

    res.json({ channel, updatedUser });
  } catch (err) {
    console.error("Error in updateChannel:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a channel, remove its videos, and update the user's channel list.
 * @route DELETE /api/channels/:channelId
 * @access Private
 * @param {Object} req - Express request object (expects req.params.channelId, req.user)
 * @param {Object} res - Express response object
 * @returns {Object} JSON message and updated user
 */

export const deleteChannel = async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user.id; // from verifyToken middleware

  try {
    // 1. Find and delete the channel
    const channel = await Channel.findOneAndDelete({ channelId });
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // 2. Delete all videos that belong to this channel
    const deletedVideos = await Video.find({ channelId });
    const deletedVideoIds = deletedVideos.map((v) => v._id);

    await Video.deleteMany({ channelId });

    // 3. Remove deleted video IDs from user's uploadedVideos list
    await User.findByIdAndUpdate(userId, {
      $pull: { uploadedVideos: { $in: deletedVideoIds } },
    });

    // 4. Remove the deleted channel from the user's channels list
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { channels: channel._id } },
      { new: true }
    ).populate("channels");

    // 5. Update default channel if necessary
    if (updatedUser.defaultChannel === channelId) {
      if (updatedUser.channels.length > 0) {
        updatedUser.defaultChannel = updatedUser.channels[0].channelId;
      } else {
        updatedUser.defaultChannel = null;
      }
      await updatedUser.save();
    }

    res.json({
      message:
        "Channel and associated videos deleted. Default channel updated if needed.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting channel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Fetch all channels created by the current user.
 * @route GET /api/channels
 * @access Private
 * @param {Object} req - Express request object (expects req.user)
 * @param {Object} res - Express response object
 * @returns {Array} List of user's channels
 */

export const getAllChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const channels = await Channel.find({ owner: userId });
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Subscribe the current user to a channel by channelId.
 * @route POST /api/channels/:channelId/subscribe
 * @access Private
 * @param {Object} req - Express request object (expects req.user and req.params.channelId)
 * @param {Object} res - Express response object
 * @returns {Object} Subscription status and count
 */

export const subscribeChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;

    const channel = await Channel.findOne({ channelId });
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const user = await User.findById(userId);

    // Check if already subscribed (compare channel._id)
    const isSubscribed = user.subscriptions.includes(channel._id);
    if (isSubscribed) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    // Subscribe
    channel.subscribersList.push(user._id);
    channel.subscribers = channel.subscribersList.length;
    await channel.save();

    user.subscriptions.push(channel._id);
    await user.save();

    res
      .status(200)
      .json({
        message: "Subscribed successfully",
        subscribers: channel.subscribers,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Unsubscribe the current user from a channel by channelId.
 * @route POST /api/channels/:channelId/unsubscribe
 * @access Private
 * @param {Object} req - Express request object (expects req.user and req.params.channelId)
 * @param {Object} res - Express response object
 * @returns {Object} Unsubscription status and count
 */

export const unsubscribeChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;

    const channel = await Channel.findOne({ channelId });
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const user = await User.findById(userId);

    // Check if subscribed
    const isSubscribed = user.subscriptions.includes(channel._id);
    if (!isSubscribed) {
      return res.status(400).json({ message: "Not subscribed" });
    }

    // Unsubscribe
    channel.subscribersList = channel.subscribersList.filter(
      (sub) => sub.toString() !== userId
    );
    channel.subscribers = channel.subscribersList.length;
    await channel.save();

    user.subscriptions = user.subscriptions.filter(
      (sub) => sub.toString() !== channel._id.toString()
    );
    await user.save();

    res
      .status(200)
      .json({
        message: "Unsubscribed successfully",
        subscribers: channel.subscribers,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all channels owned by the current user (same as getAllChannels).
 * @route GET /api/channels/my
 * @access Private
 * @param {Object} req - Express request object (expects req.user)
 * @param {Object} res - Express response object
 * @returns {Array} List of owned channels
 */

export const getMyChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const channels = await Channel.find({ owner: userId });
    res.json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch channels" });
  }
};

/**
 * Get the list of channels that the user is subscribed to.
 * If defaultChannel is set, returns only that channel with populated subscribers.
 * @route GET /api/channels/subscriptions
 * @access Private
 * @param {Object} req - Express request object (expects req.user)
 * @param {Object} res - Express response object
 * @returns {Array} Subscribed channels or the default channel with subscribers
 */

export const getSubscribedChannels = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Find the user's profile and get their defaultChannel
    const user = await User.findById(userId).select("defaultChannel");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: If the user has a defaultChannel, only fetch that channel
    if (user.defaultChannel) {
      // Use channelId (a string) instead of _id (ObjectId) to query the Channel collection
      const channel = await Channel.findOne({ channelId: user.defaultChannel })
        .select("subscribersList _id")
        .populate("subscribersList");

      if (!channel) {
        return res.status(404).json({ message: "Default channel not found" });
      }

      return res.status(200).json([channel]); // Return only the default channel
    }

    // Step 3: If no defaultChannel, fetch all subscribed channels
    const subscribedChannels = await Channel.find({
      subscribersList: userId,
    }).select("channelName channelImage _id");

    return res.status(200).json(subscribedChannels); // Return the subscribed channels
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subscribed channels" });
  }
};
