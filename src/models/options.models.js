import mongoose, { Schema } from "mongoose";

const optionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

export const Option = mongoose.model("Option", optionSchema);
