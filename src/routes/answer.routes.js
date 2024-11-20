import { Router } from "express";
import { verifyJWT,checkAdmin } from "../middlewares/auth.middelwares.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { answerTo } from "../controllers/answer.controllers.js";


const answerRouter = Router()

answerRouter.route("/answer/:id").post(verifyJWT, checkAdmin, asyncHandler( async(req,res) => {
    console.log("In /answer/:id");
    const received = await answerTo(req,res)
    console.log(received);
    res.json(received)
} ) )

export {answerRouter}