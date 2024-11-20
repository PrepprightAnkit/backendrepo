import { CourseApproval } from '../models/courseApproval.model.js';
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/student.models.js"



const uploadCourseApproval = asynchandler(async (req, res) => {
  const { courseId, userId, transactionId } = req.body;

  // Validate required fields
  if ([courseId, userId].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Course ID and User ID are required");
  }

  // Check if a payment confirmation image is provided
  const paymentConfirmationImageLocalPath = req.files?.paymentConfirmationImage?.[0]?.path;

  let paymentConfirmation;
  if (paymentConfirmationImageLocalPath) {
    paymentConfirmation = await uploadOnCloudinary(paymentConfirmationImageLocalPath);
  }

  // Create a new CourseApproval entry
  const courseApproval = await CourseApproval.create({
    course: courseId,
    user: userId,
    paymentConfirmationImage: paymentConfirmation?.url || "",
    transactionId: transactionId || "",
  });

  // Retrieve the newly created CourseApproval entry
  const createdCourseApproval = await CourseApproval.findById(courseApproval._id).select();

  if (!createdCourseApproval) {
    throw new ApiError(500, "Something went wrong while registering the course approval");
  }

  // Return the created CourseApproval entry in the response
  return res.status(201).json(
    new ApiResponse(200, createdCourseApproval, "Course approval registered successfully")
  );
});

const approveCourse = asynchandler(async (req, res) => {
  const { courseId, userId } = req.body;

  if (!courseId || !userId) {
    throw new ApiError(400, "Course ID and User ID are required");
  }

  const courseApproval = await CourseApproval.findOne({ course: courseId, user: userId });
  if (!courseApproval) {
    console.log(courseId,userId);
    
    throw new ApiError(404, "Course approval not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const courseAlreadyTaken = user.coursesTaken.some((course) => course.course.toString() === courseId);
  if (courseAlreadyTaken) {
    await CourseApproval.findOneAndDelete({ course: courseId, user: userId });
    throw new ApiError(409, "Course already approved for this user");
  }

  user.coursesTaken.push({
    course: courseId,
    progress: 0,
    lessons: [], // Assuming that lessons will be added as the course progresses
  });

  await user.save();

  await CourseApproval.findOneAndDelete({ course: courseId, user: userId });

  res.status(200).json({ message: "Course approved and added to user's coursesTaken." });
});


  

  const getAllCourseApprovals = asynchandler(async (req, res) => {
    // Query the database for all course approvals
    const courseApprovals = await CourseApproval.find()
      .populate('course', 'courseName') // Assuming courseName is a field in the course schema
      .populate('user', 'fullName email') // Assuming fullName and email are fields in the user schema
      .select('-__v -createdAt -updatedAt'); // Exclude fields like __v, createdAt, and updatedAt if not needed
  
    // Check if any course approvals were found
    if (!courseApprovals || courseApprovals.length === 0) {
      throw new ApiError(404, "No course approvals found");
    }
  
    // Return the list of course approvals in the response
    return res.status(200).json(
      new ApiResponse(200, courseApprovals, "Course approvals retrieved successfully")
    );
  });
  
  export {
    uploadCourseApproval,
    approveCourse,
    getAllCourseApprovals
  };