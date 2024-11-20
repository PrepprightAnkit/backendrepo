import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/student.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Utility function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

// Register User
const registerUser = asynchandler(async (req, res) => {
    const {
        fullName,
        email,
        phoneNumber,
        password,
        role,
        institution,
        yearOrRole,
        fieldOrDepartment,
        preferredLearningMode,
        courseCategories,
        preferredContactMethod
    } = req.body;

    if (
        [fullName, email, password, role, institution, yearOrRole, preferredLearningMode, preferredContactMethod]
            .some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All required fields must be filled out");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }
    let isAdmin=false;

    const avatarLocalPath = req.files?.profilePicture?.[0]?.path;

    let profilePicture;
    if (avatarLocalPath) {
        profilePicture = await uploadOnCloudinary(avatarLocalPath);
    }

    const user = await User.create({
        fullName,
        email,
        phoneNumber,
        password,
        role,
        isAdmin,
        institution,
        yearOrRole,
        fieldOrDepartment,
        preferredLearningMode,
        courseCategories,
        profilePicture: profilePicture?.url || "",
        preferredContactMethod
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});



const updateQuizScore = asynchandler(async (req, res) => {
    const { userId, quizId, score } = req.body;
  
    if (!userId || !quizId || score === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "User ID, Quiz ID, and Score are required fields.",
      });
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }
  
    // Check if the quiz already exists in the user's quizzes array
    const quizIndex = user.quizes.findIndex(
      (quizScore) => quizScore.quiz.toString() === quizId
    );
  
    if (quizIndex !== -1) {
      // If the quiz exists, update the score
      user.quizes[quizIndex].score = score;
    } else {
      // If the quiz does not exist, add it to the quizzes array
      user.quizes.push({ quiz: quizId, score });
    }
  
    await user.save();
  
    return res.status(200).json({
      status: "success",
      data: {
        message: "Quiz score updated successfully.",
        quizes: user.quizes,
      },
    });
  });
  
// Login User
const loginUser = asynchandler(async (req, res) => {
    const { email,  password } = req.body;

    if (!email) {

        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        email 

        
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };
    console.log(loggedInUser);
    

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(  loggedInUser      );
});

// Logout User
const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };
    console.log('User has loggedou');
    

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

// Refresh Access Token
const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// Change Current Password
const changeCurrentPassword = asynchandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get Current User
const getCurrentUser = asynchandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ));
});

// Update Account Details
const updateAccountDetails = asynchandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// Update User Avatar
const updateUserAvatar = asynchandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        );
});

// Update User Cover Image
const updateUserCoverImage = asynchandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    // TODO: delete old image - assignment

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        );
});

// Get All Users
const getAllUsers = asynchandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");

    if (!users || users.length === 0) {
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    updateQuizScore,
    getAllUsers // Add this line to export the new controller
};
