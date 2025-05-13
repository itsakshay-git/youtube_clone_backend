import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    dob: {
      day: { type: String },
      month: { type: String },
      year: { type: String },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    defaultChannel: {
      type: String,
      default: null,
    },
    uploadedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    likedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    watchLater: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  { timestamps: true }
);

// Static method to get full user profile with populated fields
userSchema.statics.getFullProfile = function (userId) {
  return this.findById(userId)
    .populate("channels")
    .populate("defaultChannel")
    .populate({
      path: "playlists",
      populate: {
        path: "videos",
        select: "title videoId thumbnailUrl",
      },
    })
    .populate({
      path: "uploadedVideos",
      select: "title videoId thumbnailUrl",
    });
};

export default mongoose.model("User", userSchema);
