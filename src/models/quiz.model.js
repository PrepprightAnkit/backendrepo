import mongoose, { Schema } from "mongoose";

const optionSchema = new Schema({
  text: { 
    type: String, 
    required: true 
  },
  isCorrect: { 
    type: Boolean, 
    required: true, 
    default: false 
  }
});

const questionSchema = new Schema({
  identifier: { 
    type: Number, 
    required: true 
  },
  question: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String // URL or path to the image
  },
  options: [optionSchema]
});

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    questions: [questionSchema],
    score:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
