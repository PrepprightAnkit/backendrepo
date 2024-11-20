import mongoose, { Schema } from "mongoose";

const certificateSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  certificateURL: {
    type: String,
    required: true, // URL to the generated certificate
  },
  awardedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Certificate = mongoose.model("Certificate", certificateSchema);
