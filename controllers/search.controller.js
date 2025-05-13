import Video from "../models/Video.js";
import Playlist from "../models/Playlist.js";

/**
 * Fetches search suggestions for videos and playlists based on a query parameter.
 * Returns the top 5 video suggestions and 5 playlist suggestions.
 *
 * @route GET /api/search/suggestions
 * @param {object} req - The request object, containing the query parameter `q` for search.
 * @param {object} res - The response object, which returns an array of search suggestions.
 * @returns {Array} - An array of search suggestions containing both video and playlist results.
 * @throws {500} - If there is an error fetching search suggestions.
 */

export const getSearchSuggestions = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") return res.json([]);

    const videoSuggestions = await Video.find({
      title: { $regex: q, $options: "i" },
    })
      .select("title _id videoId")
      .limit(5);

    const playlistSuggestions = await Playlist.find({
      name: { $regex: q, $options: "i" },
    })
      .select("name _id videos")
      .limit(5)
      .populate({
        path: "videos",
        select: "title _id videoId",
      });

    const combined = [
      ...videoSuggestions.map((v) => ({
        type: "video",
        title: v.title,
        videoId: v.videoId,
      })),
      ...playlistSuggestions.map((p) => ({
        type: "playlist",
        title: p.name,
        videos: p.videos,
        playlistId: p._id,
      })),
    ];

    res.json(combined);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
};

/**
 * Searches for videos and playlists based on a query parameter and returns the results.
 *
 * @route GET /api/search
 * @param {object} req - The request object, containing the query parameter `q` for search.
 * @param {object} res - The response object, which returns an object containing videos and playlists.
 * @returns {object} - An object containing arrays of videos and playlists.
 * @throws {500} - If there is an error during the search.
 */

export const searchContent = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") return res.json({ videos: [], playlists: [] });

    const videos = await Video.find({
      title: { $regex: q, $options: "i" },
    });

    const playlists = await Playlist.find({
      name: { $regex: q, $options: "i" },
    }).populate("videos");

    res.json({ videos, playlists });
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
