import { Course } from '../models/courses.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asynchandler } from '../utils/asynchandler.js';

export const getCourseById = asynchandler(async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }
    res.status(200).json(new ApiResponse(200, course, 'Course details retrieved successfully'));
  } catch (err) {
    throw new ApiError(500, err.message);
  }
});
