# YouTube Clone - Backend

This is the Express.js and MongoDB backend powering the YouTube Clone project.

---

## Git Repositories

- [Backend Repo](./backend)

---

## 📁 Folder Structure

```
backend/
├── config/        # MongoDB connection
├── controllers/   # Business logic
├── middleware/    # Upload & auth middleware
├── models/        # Mongoose models
├── routes/        # REST API routes
├── seeder/        # DB seeding scripts
├── uploads/       # Local media storage
├── utils/         # Cloudinary helpers
├── .env
├── server.js
```

---

## ⚙️ Local Setup

```bash
cd backend
npm install
npm run seed
npm run dev
```

> Seeds DB with dummy users, channels, and videos.

---

## 🔁 Seeder Instructions

```bash
npm run seed
```

Seeds DB with dummy users, channels, and videos.

---

## 🔐 Environment Variables

```env
MONGO_URI=mongodb:
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PORT=5000
```

> Make sure to create a `.env` file with the necessary credentials.

---

## 📡 API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/check-email`
- `PUT /api/auth/reset-password`
- `GET /api/auth/me`

### Channel

- `DELETE /api/channels/:channelId`
- `PUT /api/channels/subscribe/:channelId`
- `PUT /api/channels/unsubscribe/:channelId`
- `GET /api/channels/my-channels`
- `GET /api/channels/subscriptions/me`

### Video

- `GET /api/videos/`
- `GET /api/videos/:videoId`
- `POST /api/videos/:upload`
- `PUT /api/videos/like/:videoId`
- `PUT /api/videos/dislike/:videoId`
- `POST /api/videos/:videoId/view`
- `PUT /api/videos/history/:id`
- `PUT /api/videos/watch-later/:id`
- `DELETE /api/videos/:videoId`
- `PUT /api/videos/:videoId`

### Comments

- `POST /api/comments/:id/comments`
- `DELETE /api/comments/:videoId/comments/:commentId`

### Playlist

- `POST /api/playlist/create`
- `GET /api/playlist/user/:userId`
- `PUT /api/playlist/:playlistId/add-video`
- `PUT /api/playlist/:playlistId/remove-video`
- `DELETE /api/playlist/:playlistId`
- `PUT /api/playlist/:playlistId`

### User

- `PUT /api/user/set-default-channel`
- `GET /api/user/history`
- `GET /api/user/liked`
- `GET /api/user/watch-later`
- `DELETE /api/user/history`
- `DELETE /api/user/history/:videoId`
- `DELETE /api/user/liked/:videoId`
- `DELETE /api/user/:watch-later/:videoId`

### Search

- `GET /api/search/?q=query`
- `GET /api/search/suggestions`

---

## ☁️ Uploads

- `/uploads/videos`
- `/uploads/thumbnails`
- `/uploads/banners`

Cloudinary is used for public access and delivery of assets.

---

## 📦 Dependencies

- Express
- Mongoose
- Multer
- Cloudinary SDK
- JWT
- Dotenv
