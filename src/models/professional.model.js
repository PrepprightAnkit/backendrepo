import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const profSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
       
        profilePicture: {
            type: String
        },
       
        yearsOfExperience: {
            type: Number,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        graduationYear: {
            type: Number,
            required: true
        },
        collegeName: {
            type: String,
            required: true,
            trim: true
        },
        currentCompany: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);


export const Prof = model("Professional", profSchema);
