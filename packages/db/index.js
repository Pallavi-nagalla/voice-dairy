const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

const EntrySchema = new mongoose.Schema(
  {
    rawTranscript: { type: String, required: true },
    refinedEntry: { type: String, default: "" },
    title: { type: String, default: "Untitled Entry" },
    summary: { type: String, default: "" },
    mood: {
      type: String,
      enum: [
        "happy",
        "sad",
        "nostalgic",
        "anxious",
        "excited",
        "calm",
        "angry",
      ],
      default: "calm",
    },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

const Entry = mongoose.models.Entry || mongoose.model("Entry", EntrySchema);

module.exports = { connectDB, Entry };
