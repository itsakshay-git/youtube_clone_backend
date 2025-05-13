import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Playlist from "../models/Playlist.js";

export const seedUsers = async () => {

  const hashedPassword = await bcrypt.hash("pass123", 10);

  const userData = [
    {
      username: "user01",
      avatar:
        "https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2080&auto=format&fit=crop",
      email: "user01@example.com",
      password: hashedPassword,
      playlists: [],
      uploadedVideos: [],
      channels: [],
      defaultChannel: null,
    },
    {
      username: "Internshala",
      avatar:
        "https://yt3.googleusercontent.com/foVCTywFAyUZG05GpiGEAJhgOv7UFcgm-ymCTAxXg85tMvc506VvSUo4xsbsAavj1DrTbaqTW10=s160-c-k-c0x00ffffff-no-rj",
      email: "Internshala@example.com",
      password: hashedPassword,
      playlists: [],
      uploadedVideos: [],
      channels: [],
      defaultChannel: null,
    },
    {
      username: "user03",
      avatar:
        "https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2080&auto=format&fit=crop",
      email: "user03@example.com",
      password: hashedPassword,
      playlists: [],
      uploadedVideos: [],
      channels: [],
      defaultChannel: null,
    },
  ];

  await User.deleteMany();
  const users = await User.insertMany(userData);
  console.log("Users seeded");

  const playlistData = [
    {
      name: "Favorites",
      userId: users[0]._id,
      videos: [],
      isPrivate: false,
    },
    {
      name: "Watch Later",
      userId: users[2]._id,
      videos: [],
      isPrivate: false,
    },
    {
      name: "Trending",
      userId: users[2]._id,
      videos: [],
      isPrivate: true,
    },
  ];

  await Playlist.deleteMany();
  const playlists = await Playlist.insertMany(playlistData);

  await User.updateMany(
    { _id: { $in: users.map((u) => u._id) } },
    { $addToSet: { playlists: { $each: playlists.map((p) => p._id) } } }
  );

  console.log("Playlists seeded");

  return users;
};
