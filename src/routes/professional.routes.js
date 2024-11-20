import { Router } from "express";
import { registerProfessional } from "../controllers/professional.controllers.js";
import { upload } from "../middlewares/multer.middlware.js"
const router = Router();

router.route("/registerProfessional").post(
    upload.fields([
      
        {
            name: "profilePicture",
            maxCount: 1
        }

    ]),
    registerProfessional);

export default router; // Default export
