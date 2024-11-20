import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    answer:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Question"
    }
},{timestamps:true})

export const Answer = mongoose.model("Answer", answerSchema)