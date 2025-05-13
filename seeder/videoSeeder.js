import { v4 as uuidv4 } from "uuid";
import Video from "../models/Video.js";
import User from "../models/User.js";
import Playlist from "../models/Playlist.js";
import Channel from "../models/Channel.js";

export const seedVideos = async (users, channels) => {
  await Video.deleteMany();

  const user01 = users.find((u) => u.username === "user01");
  const internshala = users.find((u) => u.username === "Internshala");
  const user03 = users.find((u) => u.username === "user03");

   // Get channels owned by each user
  const user01Channel = channels.find((ch) => ch.owner.toString() === user01._id.toString());
  const internshalaChannel = channels.find((ch) => ch.owner.toString() === internshala._id.toString());
  const user03Channel = channels.find((ch) => ch.owner.toString() === user03._id.toString());

  const sampleVideos = [
    {
      videoId: uuidv4(),
      title: "Neil Sedaka 'Oh Carol'",
      thumbnailUrl: "https://i.ytimg.com/vi/e72tG80LmsU/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=e72tG80LmsU",
      description: "Saturday Night Beech-Nut Show. December 05, 1959",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [],
      uploadDate: new Date("2024-09-20"),
      category: "Music",
      comments: [
        {
          commentId: "comment01",
          userId: user01._id,
          text: "Great video! Very helpful.",
          timestamp: new Date("2024-09-21T08:30:00Z"),
        },
        {
          commentId: "comment02",
          userId: user01._id,
          text: "Great video!",
          timestamp: new Date("2024-09-21T08:30:00Z"),
        },
      ],
    },
    {
      videoId: uuidv4(),
      title: "Marvel Major Problem - No One is Talking About This !!",
      thumbnailUrl: "https://i.ytimg.com/vi/SiRQ-8t8D2k/hq720.jpg",
      videoUrl: "https://www.youtube.com/watch?v=SiRQ-8t8D2k",
      description: "Why you're not as invested in the Multiverse Saga?",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Entertainment",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "THUNDERBOLTS Final Trailer (4K ULTRA HD) 2025",
      thumbnailUrl: "https://i.ytimg.com/vi/-sAOWhvheK8/hq720.jpg",
      videoUrl: "https://www.youtube.com/watch?v=rftrMxmtb_8",
      description:
        "Thunderbolts: antiheroes must confront the darkest corners of their pasts.",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Movies",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "The Last of Us (Main Theme) | fingerstyle guitar",
      thumbnailUrl:
        "https://i.ytimg.com/vi/Bm4oalrPlbQ/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBxNQothU0bqeszoufQOmaJ42zdXw",
      videoUrl: "https://www.youtube.com/watch?v=Bm4oalrPlbQ",
      description: "When you’re lost in the darkness, look for the light.",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "Hanumankind - Run It Up ( Prod. By Kalmi ) | (Official Music Video)",
      thumbnailUrl:
        "https://i.ytimg.com/vi/MbJ72KO5khs/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLDizUaQygAbiwa4G93MrlfQDK8kOQ",
      videoUrl:
        "https://www.youtube.com/watch?v=MbJ72KO5khs&list=RDEMJkfAYHaXV_UMM9c2W9_Qbg&start_radio=1",
      description: "Run It Up!",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Hanumankind | Big Dawgs (Slowed + Reverb) | Jiu Ji-tae's version",
      thumbnailUrl:
        "https://i.ytimg.com/vi/JnLGAniJmwM/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLDB2aGKKYtWqUWkP7GiZW1slA778w",
      videoUrl:
        "https://www.youtube.com/watch?v=JnLGAniJmwM&list=RDEMJkfAYHaXV_UMM9c2W9_Qbg&index=2",
      description: "Help me with my work by donating as much as you want! :D",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Peacemaker Season 2 | Official Teaser | Max",
      thumbnailUrl:
        "https://i.ytimg.com/vi/-QwXokuIZjM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBkfU-Fh000tF1Fsn0rdfOFIyJxyg",
      videoUrl: "https://www.youtube.com/watch?v=-QwXokuIZjM",
      description: "Achieving peace is a team effort.",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Movies",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "The 1975 - About You (Official)",
      thumbnailUrl:
        "https://i.ytimg.com/vi/tGv7CUutzqU/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLAS8AthHkBAo5aTUJE7C0ZSdoSsRg",
      videoUrl:
        "https://www.youtube.com/watch?v=tGv7CUutzqU&list=RDEMqNiADTQ6W7zFH3lMugz3Vg&start_radio=1",
      description: "The 1975 - About You",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },

    {
      videoId: uuidv4(),
      title: "The 1975 - I'm In Love With You (Official Video)",
      thumbnailUrl:
        "https://i.ytimg.com/vi/UVzVUDXoi0Y/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLCU_zeItxz9Idk-5HR2X7PScdaScQ",
      videoUrl:
        "https://www.youtube.com/watch?v=UVzVUDXoi0Y&list=RDEMqNiADTQ6W7zFH3lMugz3Vg&index=2",
      description:
        "The 1975 - I’m In Love With You Being Funny In A Foreign Language The new album. ",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "The 1975 - A Change Of Heart (Official Video)",
      thumbnailUrl:
        "https://i.ytimg.com/vi/trbwqF0d7NA/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLC1-ooBRsTCgof45S8eQ_1b1K926A",
      videoUrl:
        "https://www.youtube.com/watch?v=trbwqF0d7NA&list=RDEMqNiADTQ6W7zFH3lMugz3Vg&index=3",
      description:
        "The 1975 - I’m In Love With You Being Funny In A Foreign Language The new album. ",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Harry Styles - Adore You (Official Video)",
      thumbnailUrl:
        "https://i.ytimg.com/vi/VF-r5TtlT9w/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLBnlmkuiCPfxEmyKDqiRDTPjoiO6g",
      videoUrl:
        "https://www.youtube.com/watch?v=VF-r5TtlT9w&list=RDEMqNiADTQ6W7zFH3lMugz3Vg&index=12",
      description:
        "Listen to Harry Styles’ new album ‘Fine Line’ now: https://HStyles.lnk.to/FineLineAY",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Khalid - Young Dumb & Broke (Official Video)",
      thumbnailUrl:
        "https://i.ytimg.com/vi/IPfJnp1guPc/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLBqfilN3r159r0MO4UcoysBj-8Msg",
      videoUrl:
        "https://www.youtube.com/watch?v=IPfJnp1guPc&list=RDEMU0MaQkzDxLqAohdENP67wg&index=3",
      description: "Young Dumb & Broke” by Khalid",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },

    {
      videoId: uuidv4(),
      title:
        "Polyphia | Yas feat. Mario Camarena and Erick Hansel (Official Music Video)",
      thumbnailUrl:
        "https://i.ytimg.com/vi/2hln1TOQUZ0/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGGUgWShkMA8=&rs=AOn4CLCfN9ddFVE0WIdkzwX4kMGBoVVZ7g",
      videoUrl: "https://www.youtube.com/watch?v=2hln1TOQUZ0",
      description:
        "Yas is from Polyphia's album, New Levels New Devils, out now.",
      channelId: user01Channel.channelId,
      uploader: user01._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Music",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "FANTASTIC FOUR TRAILER: Why They Fight X-Men & New Avengers in Doomsday",
      thumbnailUrl:
        "https://i.ytimg.com/vi/xEz2v7tF1-4/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLB466pu3P0pEmjWDSkXWJtulzyy5g",
      videoUrl: "https://www.youtube.com/watch?v=xEz2v7tF1-4",
      description:
        "Fantastic Four Why They Fight X-Men & New Avengers in Avengers Doomsday. Fantastic Four Trailer, Thunderbolts Post Credit Scene, Avengers Doomsday Trailer, Doctor Doom vs X-Men & Avengers Secret Wars Teaser",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Movies",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "The Fantastic Four: First Steps | Official Trailer ",
      thumbnailUrl:
        "https://i.ytimg.com/vi/pAsmrKyMqaA/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBU3GdyoQjELKvUIa546mw328IYfw",
      videoUrl: "https://www.youtube.com/watch?v=pAsmrKyMqaA",
      description: "Together. As a family.",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Movies",
      comments: [],
    },

    {
      videoId: uuidv4(),
      title:
        "How to Build Any Software Project from Scratch: Step-by-Step Guide for Beginners!",
      thumbnailUrl:
        "https://i.ytimg.com/vi/thxQOVMpr2Q/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDhanzS4sJtUfadufZXV0_08fuLZg",
      videoUrl: "https://www.youtube.com/watch?v=thxQOVMpr2Q",
      description:
        "Learn how to build any software project from scratch with this comprehensive step-by-step guide! Whether you're working on a college project, an internship assignment.",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Development",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Godzilla x Kong: Supernova | Now in Production",
      thumbnailUrl:
        "https://i.ytimg.com/vi/pa3nW0EYYcQ/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCwzUOjT4cdKX1zVJMxRMlP7vFtdg",
      videoUrl: "https://www.youtube.com/watch?v=pa3nW0EYYcQ",
      description:
        "Please stand by. Your call is very important to us. Godzilla x Kong: Supernova | Now in production. Only in theaters March 26, 2027. Report a Titan Sighting. Call (240) MON-ARCH",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Movies",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "5 DOM Projects In JavaScript | Don't Miss It | Beginner to Pro",
      thumbnailUrl:
        "https://i.ytimg.com/vi/rwuFmRQJ948/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLALvbsQicdLCr3VoysdOb2_9SqsxA",
      videoUrl: "https://www.youtube.com/watch?v=rwuFmRQJ948",
      description:
        "✅ Everything is 100% FREE — Make sure to follow on all platforms and tap every link to get full access to content and community support!",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Javascript",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "The Walking Dead: Dead City Season 2 First Scene",
      thumbnailUrl:
        "https://i.ytimg.com/vi/ewSY2KWW9t4/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDgZFf_VqUgOCpAutRv79QTWO7yUw",
      videoUrl: "https://www.youtube.com/watch?v=ewSY2KWW9t4",
      description:
        "We are BACK in the New York groove and it all starts here. 🧟‍♀️",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Entertainment",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Best AI Tools to Get An Internship in 2025 For College Students",
      thumbnailUrl:
        "https://i.ytimg.com/vi/3ABtu_AfxJQ/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDH8dDiVHjHR28Keo-lghA33fL6ZA",
      videoUrl: "https://www.youtube.com/watch?v=3ABtu_AfxJQ",
      description:
        "Are you tired of sending out countless internship applications without getting noticed? Want to stand out from the competition and land your dream internship?",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Education",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "TOP Internship Opportunities for College Students OFF CAMPUS in 2025!",
      thumbnailUrl:
        "https://i.ytimg.com/vi/e8K-3koHqZU/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDEFNuTIeSMUzjmX29Z_z--PZ9sbQ",
      videoUrl: "https://www.youtube.com/watch?v=e8K-3koHqZU",
      description:
        "Looking for the best internship opportunities for college students off campus in 2025?",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Education",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Internshala Review - UI/UX Design Placement Guarantee Course",
      thumbnailUrl:
        "https://i.ytimg.com/vi/PdMng6fxr1s/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDSurtIOQYAzGEgSVTLEc_U0qgFKA",
      videoUrl: "https://www.youtube.com/watch?v=PdMng6fxr1s",
      description:
        "In today's episode of Inki Kahani Inki Zubani will share her journey of becoming an UI/UX Design intern at MakerSharks Inc.",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Education",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "Internshala Full Stack Development Course Review | Internshala Placement Guarantee CourseInternshala Review - UI/UX Design Placement Guarantee Course",
      thumbnailUrl:
        "https://i.ytimg.com/vi/QY5eeFmIHJo/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDerF1Wuo8kIGvPenE0zldlu3ALLA",
      videoUrl: "https://www.youtube.com/watch?v=QY5eeFmIHJo",
      description:
        "In today's episode of Inki Kahani Inki Zubani, Vikas, a student of the Full Stack Development Placement Guarantee",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Education",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "CI/CD Explained: The DevOps Skill That Makes You 10x More Valuable",
      thumbnailUrl:
        "https://i.ytimg.com/vi/AknbizcLq4w/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDaNi0KxFn-4rXJO9iOfbU5kl07iA",
      videoUrl: "https://www.youtube.com/watch?v=AknbizcLq4w",
      description:
        "CI/CD Explained with Real Life Examples | How DevOps Teams Automate Everything",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Education",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "Get Hired FAST in 2025: Resume & Interview Calls – Real Strategy to Crack High Paying Job!",
      thumbnailUrl:
        "https://i.ytimg.com/vi/76tylK32rmg/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAyYS1XqDP-rsu4x1UYXbdS3cmcuQ",
      videoUrl: "https://www.youtube.com/watch?v=76tylK32rmg",
      description: "⭐ Checkout Free AI-mock interview",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Podcast",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "Max’s Song (Full Scene) | Kate Bush - Running Up That Hill | Stranger Things | Netflix",
      thumbnailUrl:
        "https://i.ytimg.com/vi/bV0RAcuG2Ao/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAx4hcsaWZqTQo902pP679h2BEOng",
      videoUrl: "https://www.youtube.com/watch?v=bV0RAcuG2Ao",
      description:
        "It's true: 'Running Up That Hill' by Kate Bush can literally save the universe. ",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Science Fiction",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Clash of Clans: Hog Rider 360°",
      thumbnailUrl:
        "https://i.ytimg.com/vi/yVLfEHXQk08/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLB98zNkUYxg0Ysf3FeXAk2-9FiXKA",
      videoUrl: "https://www.youtube.com/watch?v=yVLfEHXQk08",
      description: "Hog Rider Virtual Reality is Here.",
      channelId: internshalaChannel.channelId,
      uploader: internshala._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Clash of Clan",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title:
        "Pakistan was about to use Nuclear weapon against India? Deep analysis",
      thumbnailUrl:
        "https://i.ytimg.com/vi/bYAMLRrLW_M/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLD5SyubShLqSUIUbFDrt66cr5EqvQ",
      videoUrl: "https://www.youtube.com/watch?v=bYAMLRrLW_M",
      description: "Click here to enroll",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "news",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "5 very EXPENSIVE & Unique Gadgets I Bought Online !",
      thumbnailUrl:
        "https://i.ytimg.com/vi/J8zLXe1BuVM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCLKOtpiFPmajiCxHJTbgjnaJ6dXw",
      videoUrl: "https://www.youtube.com/watch?v=J8zLXe1BuVM",
      description: "5 very EXPENSIVE & Unique Gadgets I Bought Online !",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Computer Hardware",
      comments: [],
    },
    {
      videoId: uuidv4(),
      title: "Porsche 992 GT3 Black Forest Drive | RAW Sound",
      thumbnailUrl:
        "https://i.ytimg.com/vi/c5LeLdbK_-A/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBXJxsUc2aKD1-VDlTloWSG77tL2w",
      videoUrl: "https://www.youtube.com/watch?v=c5LeLdbK_-A",
      description:
        "Since the 996 Carrera 4S Video is the most popular and liked one on the Channel, I thought I could film a similar Style",
      channelId: user03Channel.channelId,
      uploader: user03._id,
      views: [user01._id, user03._id],
      likes: [internshala._id, user03._id],
      dislikes: [user01._id],
      uploadDate: new Date("2024-09-22"),
      category: "Automobiles",
      comments: [],
    },
  ];

 const insertedVideos = await Video.insertMany(sampleVideos);
  console.log("Videos seeded");

  // Add videos to playlists
  const favoritePlaylist = await Playlist.findOne({ name: "Favorites" });
  const watchLaterPlaylist = await Playlist.findOne({ name: "Watch Later" });

  if (favoritePlaylist && insertedVideos[0]) {
    favoritePlaylist.videos.push(insertedVideos[0]._id);
    await favoritePlaylist.save();
  }

  if (watchLaterPlaylist && insertedVideos[1]) {
    watchLaterPlaylist.videos.push(insertedVideos[1]._id);
    await watchLaterPlaylist.save();
  }

  // Update each channel's `videos` array
  const updatePromises = insertedVideos.map((video) =>
    Channel.findOneAndUpdate(
      { channelId: video.channelId },
      { $addToSet: { videos: video._id } }
    )
  );

  await Promise.all(updatePromises);
  console.log("Channels updated with their videos!");
};
