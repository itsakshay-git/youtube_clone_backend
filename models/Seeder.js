import mongoose from "mongoose";

const seederSchema = new mongoose.Schema({
  isSeeded: { type: Boolean, default: false },
});

export default mongoose.model("Seeder", seederSchema);