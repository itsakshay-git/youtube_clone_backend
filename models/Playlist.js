// models/Playlist.js or playlistSchema file
import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    },
  ],
  isPrivate: {
    type: Boolean,
    default: false,
  },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
