import { Router } from "express";
import { uploadCat } from "../controllers/categories.controller.js";
import { upload } from "../middlewares/multer.middlware.js";
import { getCat } from "../controllers/getCat.controller.js";
import  {getCategoryById} from "../controllers/getCategory.controller.js"
const router = Router();

router.route('/cat').get(
  getCat
)


router.route('/cat/:id').get(
    getCategoryById
  )

router.route("/cat").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    uploadCat
);

export default router;
