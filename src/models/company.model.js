import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const contactPersonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  }
});
const companyCoursesBulkPurchaseSchema = new Schema({
  teamSize: {
    type: Number,
    required: true
  },
  manager: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyPhoneNo: {
    type: String,
    required: true
  },
  companyEmailAddress: {
    type: String,
    required: true
  },
  contactPerson: {
    type: contactPersonSchema,
    required: true
  }
});
const companySchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    bulkPurchases: [companyCoursesBulkPurchaseSchema]
  },
  { timestamps: true }
);
export const Company = model("Company", companySchema);
