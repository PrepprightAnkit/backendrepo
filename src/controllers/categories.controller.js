import { Category } from '../models/categories.model.js';
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadCat = asynchandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All required fields must be filled out");
  }

  const existingCat = await Category.findOne({ title });

  if (existingCat) {
      throw new ApiError(409, "Category with this title already exists");
  }

  const avatarLocalPath = req.files?.image?.[0]?.path;

  let profilePicture;
  if (avatarLocalPath) {
      profilePicture = await uploadOnCloudinary(avatarLocalPath);
  }

  const category = await Category.create({
      title,
      description,
      image: profilePicture?.url || ""
  });

  const createdCat = await Category.findById(category._id).select();

  if (!createdCat) {
      throw new ApiError(500, "Something went wrong while registering the category");
  }

  return res.status(201).json(
      new ApiResponse(200, createdCat, "Category registered successfully")
  );
});

export {
  uploadCat,
};
