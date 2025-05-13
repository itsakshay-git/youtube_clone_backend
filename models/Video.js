import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoId: { type: String, unique: true },
    title: String,
    thumbnailUrl: String,
    description: String,
    channelId: { type: String },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    uploadDate: { type: Date, default: Date.now },
    videoUrl: String,
    category: String,
    comments: [
      {
        commentId: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Video", videoSchema);
