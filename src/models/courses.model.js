import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Lesson Schema
const LessonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videoLink: {
    type: String,
    required: true, // YouTube or other video hosting link
  },
  image: {
    type: String, // Optional image link for the lesson
  },
  notes: {
    type: String, // Google Drive link or other document link
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false, // Track if the lesson is completed by the user
  },
});

// Course Schema
const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    required: true, // Small description
  },
  detailedDescription: {
    type: String,
    required: true, // Detailed description
  },
  price: {
    type: Number,
    required: true,
  },
  courseImage: {
    type: String,
    required: true, // URL to course image
  },
  introVideo: {
    type: String,
    required: true, // Free unlisted YouTube video link for course intro
  },
  freeVideo: {
    type: String,
    required: true, // Free video link for the course
  },
  freeNotes: {
    type: String,
    required: true, // Google Drive link to free notes
  },
  lessons: {
    type: [LessonSchema], // Array of lessons
    required: true,
  },
  progress: {
    type: Number,
    default: 0, // Starts at 0 and increases as lessons are completed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const Course = mongoose.model("Course", CourseSchema);
