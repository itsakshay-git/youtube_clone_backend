import { v4 as uuidv4 } from "uuid";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

export const seedChannels = async (users) => {
  try {
    const channelDocs = [];
    let index = 1;

    // Create channels for each user
    users.forEach((user) => {
      const channel = {
        channelName: `${user.username}`,
        handle: `@${user.username.toLowerCase()}`,
        channelId: uuidv4(),
        owner: user._id,
        description: `Auto-generated channel for ${user.username}`,
        channelBanner: "https://yt3.googleusercontent.com/XjKALtYiSSS8TG2yOqgFKF3Pl3DWqu49UsmxKIn6k9nItnLLJYdvzl6m8zhKE6-6fgCun1NY=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
        channelImage: "https://yt3.googleusercontent.com/foVCTywFAyUZG05GpiGEAJhgOv7UFcgm-ymCTAxXg85tMvc506VvSUo4xsbsAavj1DrTbaqTW10=s160-c-k-c0x00ffffff-no-rj",
        subscribers: 0,
        subscribersList: [],
        videos: [],
      };
      channelDocs.push(channel);
    });

    
    // Insert channels
    const insertedChannels = await Channel.insertMany(channelDocs);
    console.log("Channels seeded successfully!");

    // Prepare updates for users to link channels
    const userChannelMap = {};

    insertedChannels.forEach((channel) => {
      const ownerId = channel.owner.toString();
      if (!userChannelMap[ownerId]) {
        userChannelMap[ownerId] = { channels: [], defaultChannel: null };
      }
      userChannelMap[ownerId].channels.push(channel._id);
      if (!userChannelMap[ownerId].defaultChannel) {
        userChannelMap[ownerId].defaultChannel = channel._id;
      }
    });

    // Update users with channels
    const userUpdatePromises = Object.entries(userChannelMap).map(
      async ([userId, { channels, defaultChannel }]) => {
        await User.findByIdAndUpdate(
          userId,
          { $addToSet: { channels: { $each: channels } }, defaultChannel },
          { new: true }
        );
      }
    );

    await Promise.all(userUpdatePromises);
    console.log("Users updated with their channels!");

  } catch (err) {
    console.error("Error seeding channels:", err);
  }
};
