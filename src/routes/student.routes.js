import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage,
    updateQuizScore, 
    getAllUsers
} from "../controllers/student.controllers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middlware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/getAllUsers").get(getAllUsers);
// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/avatar").patch(verifyJWT,  updateUserAvatar);
router.route("/cover-image").patch(verifyJWT,  updateUserCoverImage);

router.route("/updateQuiz").post(updateQuizScore);
export default router;
