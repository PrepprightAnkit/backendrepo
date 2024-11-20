import mongoose from "mongoose"; 
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Category = mongoose.model('Category', CategorySchema);


