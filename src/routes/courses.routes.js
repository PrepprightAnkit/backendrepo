import { Router } from "express";
import { uploadCourse, addLessonToCourse, updateProgress } from "../controllers/courses.controller.js";
import { getCourses } from '../controllers/getCourses.controller.js';
import { getCourseById } from "../controllers/getCoursesMain.js";
import { upload } from "../middlewares/multer.middlware.js";

const router = Router();

// Route to get all courses
router.route('/courses').get(getCourses);

// Route to get a specific course by ID
router.route('/courses/:id').get(getCourseById);

// Route to upload a new course with images and videos
router.route('/courses').post(
  upload.fields([
    {
      name: "image",
      maxCount: 1
    },
    {
      name: "videos", // If you're uploading videos, add this
      maxCount: 5 // Adjust maxCount based on your needs
    }
  ]),
  uploadCourse
);

// Route to add lessons to a course
router.route('/courseLesson').post(
  upload.single('lessonFile'), // Use `upload.single` or `upload.fields` depending on your form data
  addLessonToCourse
);

// Route to update progress
router.route('/progress').post(
  updateProgress
);

export default router;
