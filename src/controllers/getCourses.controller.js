import { Course } from '../models/courses.model.js';
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCourses = asynchandler(async (req, res) => {
  const courses = await Course.find();

  if (!courses) {
    return res.status(404).json(
      new ApiResponse(404, [], "No courses found")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, courses, "Courses retrieved successfully")
  );
});

export { getCourses };
