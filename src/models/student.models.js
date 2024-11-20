import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const quizScoreSchema = new Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

// Define the schema for tracking lesson progress within a course
const courseLessonProgressSchema = new Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["College Student", "Corporate Employee", "Other"]
    },
    isAdmin:{
      type:Boolean,
      required:true,
      default:false,
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    yearOrRole: {
      type: String,
      required: true,
      trim: true
    },
    fieldOrDepartment: {
      type: String,
      trim: true
    },
    preferredLearningMode: {
      type: String,
      required: true,
      enum: ["Live Classes", "Recorded Sessions", "Both"]
    },
    courseCategories: {
      type: [String],
      required: true,
      enum: ["Science and Technology", "Business and Management", "Arts and Humanities", "Social Sciences", "Health and Medicine", "Languages", "Personal Development"]
    },
    profilePicture: {
      type: String
    },
    preferredContactMethod: {
      type: String,
      required: true,
      enum: ["Email", "Phone", "Both"]
    },
    coursesTaken: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: {
          type: Number,
          default: 0 // Percentage of course completed (0 to 100)
        },
        lessons: [courseLessonProgressSchema] // Array to track lesson progress
      }
    ],
    quizes: [quizScoreSchema],
    progress: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};



export const User = mongoose.model("User", userSchema);
