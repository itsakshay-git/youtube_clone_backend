import multer from "multer";
import path from "path";

/**
 * Storage configuration for multer to handle file uploads.
 * It decides the destination based on file type (video or thumbnail) 
 * and generates a unique filename for each file uploaded.
 * 
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({

    /**
   * Sets the destination folder based on file type.
   * 
   * @param {Object} req - The request object.
   * @param {Express.Multer.File} file - The file being uploaded.
   * @param {function} cb - The callback function to set the destination folder.
   * @returns {void}
   */

  destination: function (req, file, cb) {
    const isVideo = file.mimetype.startsWith("video/");
    cb(null, isVideo ? "uploads/videos/" : "uploads/thumbnails/");
  },

    /**
   * Sets the filename for the uploaded file.
   * Generates a unique filename using the current timestamp and random number.
   * 
   * @param {Object} req - The request object.
   * @param {Express.Multer.File} file - The file being uploaded.
   * @param {function} cb - The callback function to set the filename.
   * @returns {void}
   */

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});


/**
 * Multer upload middleware configured to handle video and thumbnail uploads.
 * It allows for multiple files to be uploaded: one video and one thumbnail.
 * 
 * @type {multer.Instance}
 */

const upload = multer({ storage });


/**
 * Middleware to handle the uploading of video and thumbnail files.
 * 
 * @type {multer.Fieldset}
 */

export const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
