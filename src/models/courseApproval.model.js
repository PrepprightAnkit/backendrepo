import mongoose from "mongoose";

const courseApprovalSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentConfirmationImage: {
        type: String,
    },
    transactionId: {
        type: String,
    }
}, { timestamps: true });

export const CourseApproval = mongoose.model("CourseApproval", courseApprovalSchema);
