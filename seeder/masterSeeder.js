import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedUsers } from "./userSeeder.js";
import { seedVideos } from "./videoSeeder.js";
import { seedChannels } from "./channelSeeder.js";
import Channel from "../models/Channel.js";

dotenv.config();

const runAllSeeders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // 1. Seed Users
    const users = await seedUsers();

    // Step 2: Seed channels and link them to users
    await seedChannels(users);

    // Step 3: Seed videos and link them to channels
    const channels = await Channel.find();  // Fetch created channels
    await seedVideos(users, channels);


    console.log("All seeders completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runAllSeeders();
