import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/student.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Login User
const loginUser = asynchandler(async (req, res) => {
  console.log("In loginUser");

  const { email, password } = req.body;
  console.log("Received info ", req.body);

  if (!email || !password) {
    console.log("Email and password are required");
    throw new ApiError(400, "Email and password are required");
  }

  const checkUser = await User.findOne({ email });
  if (!checkUser) {
    console.log("User not found");
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await checkUser.comparePassword(password);
  if (!isPasswordValid) {
    console.log("Invalid password");
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = await checkUser.generateAccessToken();
  const refreshToken = await checkUser.generateRefreshToken();

  if (!accessToken || !refreshToken) {
    console.log("Tokens not produced");
    throw new ApiError(500, "Tokens not produced");
  }

  checkUser.refreshToken = refreshToken;
  await checkUser.save();

  const options = {
    secure: true,
    httpOnly: true,
  };

  const loggedInUser = await User.findById(checkUser._id).select("-password -refreshToken");
  console.log("User is logged in ", loggedInUser);

  const successMessage = { success: "User is logged in" };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken, refreshToken, user: loggedInUser }, successMessage));
});

const logoutUser = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const loggedOutUser = await User.findByIdAndUpdate(
    userId,
    { $set: { refreshToken: null } },
    { new: true }
  );

  if (!loggedOutUser) {
    console.log("User not found for logout");
    throw new ApiError(404, "User not found");
  }

  console.log("The logged out user ", loggedOutUser);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { user: loggedOutUser }, "Logout successful"));
});

export { loginUser, logoutUser };
