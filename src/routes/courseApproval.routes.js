// routes/courseApproval.routes.js
import { Router } from "express";
import { uploadCourseApproval, approveCourse, getAllCourseApprovals } from "../controllers/courseapproval.controller.js";
import { upload } from "../middlewares/multer.middlware.js";
const router = Router();

// Route to upload a course approval with payment confirmation image or transaction ID
router.route('/courseApproval').post(
  upload.fields([
    {
        name: "paymentConfirmationImage",
        maxCount: 1
    }
  ]), // Middleware to handle file uploads
  uploadCourseApproval
);

upload.fields([
  {
      name: "profilePicture",
      maxCount: 1
  }
]),
// Route to approve a course for a user
router.route('/approveCourse').post(
  approveCourse
);

router.route('/getApproveCourse').get(
  getAllCourseApprovals
);
export default router;
