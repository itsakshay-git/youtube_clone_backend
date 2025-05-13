import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using the connection URI specified
 * in the `MONGO_URI` environment variable.
 *
 * Utilizes Mongoose to manage the connection. If the connection fails,
 * it logs the error and terminates the Node.js process with exit code 1.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the database connection is successful.
 * @throws Will exit the process if the connection fails.
 */

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_ATLAS)
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_ATLAS);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;