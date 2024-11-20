import { Course } from '../models/courses.model.js';
import { Category } from '../models/categories.model.js';
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from '../models/student.models.js';


const updateProgress = asynchandler(async (req, res) => {
  const { userId, courseId, lessonId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Find the course in the user's coursesTaken array
    let courseProgress = user.coursesTaken.find(c => c.course.toString() === courseId);

    // Fetch the course details from the Course model if not already fetched
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (!courseProgress) {
      // If the user hasn't started this course, initialize the courseProgress
      courseProgress = {
        course: courseId,
        progress: 0, // Start with 0%
        lessons: [{ lessonId, isCompleted: true }],
      };
      user.coursesTaken.push(courseProgress);
    } else {
      // Update the lesson completion status
      const lessonProgress = courseProgress.lessons.find(l => l.lessonId.toString() === lessonId);

      if (lessonProgress) {
        lessonProgress.isCompleted = true;
      } else {
        courseProgress.lessons.push({ lessonId, isCompleted: true });
      }
    }

    // Calculate new progress
    const completedLessonsCount = courseProgress.lessons.filter(l => l.isCompleted).length;
    const totalLessonsCount = course.lessons.length;

    // If all lessons are completed, set progress to 100%
    if (completedLessonsCount === totalLessonsCount) {
      courseProgress.progress = 100;
    } else {
      courseProgress.progress = (completedLessonsCount / totalLessonsCount) * 100;
    }

    // Save the updated user
    await user.save();

    // Respond with the updated user details
    return res.status(200).json(
      new ApiResponse(200, user, "Course progress updated successfully")
    );
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw new ApiError(500, 'An error occurred while updating course progress');
  }
});


// Upload a new course with lessons and videos
const uploadCourse = asynchandler(async (req, res) => {
  const {
    title,
    price,
    description,
    detailedDescription,
    level,
    category,
    introVideo,
    freeVideo,
    freeNotes,
    lessonTitle,
    lessonNotes,
  } = req.body;

  // Validate required fields
  const requiredFields = [title, description, detailedDescription, level, category, introVideo, freeVideo, freeNotes];
  if (requiredFields.some((field) => typeof field === 'string' && field.trim() === "")) {
    throw new ApiError(400, "All required fields must be filled out");
  }

  // Ensure price is a valid number
  if (isNaN(price) || price <= 0) {
    throw new ApiError(400, "Price must be a valid positive number");
  }

  // Check if a course with the same title already exists
  const existingCourse = await Course.findOne({ title });
  if (existingCourse) {
    throw new ApiError(409, "Course with this title already exists");
  }

  // Find the category by title
  const categoryDoc = await Category.findOne({ title: category });
  if (!categoryDoc) {
    throw new ApiError(400, "Invalid category");
  }

  // Handle course image upload
  let courseImage;
  if (req.files?.image?.length > 0) {
    const imageLocalPath = req.files.image[0].path;
    const result = await uploadOnCloudinary(imageLocalPath);
    courseImage = result.url;
  } else {
    throw new ApiError(400, "Course image is required");
  }

  // Handle lesson video upload if provided
  let lessonVideo = "";
  if (req.files?.videos?.length > 0) {
    const videoPaths = req.files.videos;
    const uploadedVideos = await Promise.all(
      videoPaths.map(async (file) => {
        const result = await uploadOnCloudinary(file.path);
        return result.url;
      })
    );
    lessonVideo = uploadedVideos[0] || ""; // Use the first uploaded video URL
  }

  // Create the course with the provided details and uploaded video links in lessons
  const course = await Course.create({
    title,
    price,
    description,
    detailedDescription,
    level,
    category: categoryDoc._id,
    courseImage, // Uploaded to Cloudinary
    introVideo, // Taken as a Google Drive link from req.body
    freeVideo, // Taken as a Google Drive link from req.body
    freeNotes, // Taken as a Google Drive link from req.body
    lessons: [
      {
        title: lessonTitle || "",
        videoLink: lessonVideo, // Use uploaded video URL
        notes: lessonNotes || "",
        image: "", // Default empty string if no image provided
        isCompleted: false,
      },
    ],
  });

  // Fetch and return the created course
  const createdCourse = await Course.findById(course._id);
  if (!createdCourse) {
    throw new ApiError(500, "Something went wrong while registering the course");
  }

  return res.status(201).json(
    new ApiResponse(201, createdCourse, "Course registered successfully")
  );
});



const addLessonToCourse = asynchandler(async (req, res) => {
  const { title, notes, courseId } = req.body; // Lesson details from request body

  // Validate required fields
  if (!title ) {
    throw new ApiError(400, "Lesson title and video link are required");
  }

  // Find the existing course by ID
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Upload lesson video if a link is provided
  const videoPaths = req.files?.videos || [];
  const uploadedVideos = await Promise.all(
    videoPaths.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      return result.url;
    })
  );

  // Check if uploadedVideos has a single URL string, not an array
  const lessonVideo = uploadedVideos[0] || ""; // Use the first uploaded video URL


 
  const newLesson = {
    title,
    videoLink: lessonVideo, // Use uploaded video URL or provided link
    notes,
    image:  "", // Use uploaded image URL or an empty string
    isCompleted: false, // Default value
  };

  // Push the new lesson into the existing course's lessons array
  course.lessons.push(newLesson);

  // Save the updated course
  await course.save();

  // Respond with the updated course details
  return res.status(200).json(
    new ApiResponse(200, course, "Lesson added successfully to the course")
  );
});

export {uploadCourse,addLessonToCourse,updateProgress}