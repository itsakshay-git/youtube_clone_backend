import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import videoRoutes from "./routes/video.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import usersRoutes from "./routes/user.routes.js";
import searchRoutes from "./routes/search.route.js";
import commentsRoutes from "./routes/comments.route.js";
import connectDB from "./config/db.js";
import { runAllSeeders } from "./seeder/masterSeeder.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

/**
 * Middleware setup for CORS (Cross-Origin Resource Sharing).
 * Allows requests from specified origins and enables credentials to be included.
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://youtube-clone-frontend-indol.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Route handlers for different API endpoints.
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/search", searchRoutes);

//  Connects to the database and starts the Express server.
connectDB().then(async () => {
  await runAllSeeders();
  app.listen(PORT, () => console.log("Server running on port 5000"));
});
