import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelId: { type: String },
  channelName: { type: String, required: true },
  handle: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: String,
  channelBanner: { type: String },
  channelImage: { type: String },
  subscribers: { type: Number, default: 0 },
  subscribersList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

export default mongoose.model("Channel", channelSchema);
