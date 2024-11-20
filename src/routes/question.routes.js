import { Router } from "express";
import { asynchandler } from "../utils/asynchandler.js";
import { 
  askQuestion, 
  getQuestionsPublic, 
  likeQuestion, 
  dislikeQuestion, 
  answerQuestion, 
  likeAnswer, 
  dislikeAnswer 
} from "../controllers/question.controllers.js";

const questionRouter = Router();

// Question routes
questionRouter.route("/questionPublic").post(asynchandler(async (req, res) => {
    console.log("In /questionPublic");
    const received = await askQuestion(req, res);
    console.log(received);
    res.json(received);
}));

questionRouter.route("/getQuestions").get(asynchandler(async (req, res) => {
    console.log("In /getQuestions");
    const received = await getQuestionsPublic(req, res);
    console.log(received);
    res.json(received);
}));

questionRouter.route("/likeQuestion/:id").post(asynchandler(async (req, res) => {
    console.log("In /likeQuestion route");
    const question = await likeQuestion(req, res);
    console.log(question);
    res.json(question);
}));

questionRouter.route("/dislikeQuestion/:id").post(asynchandler(async (req, res) => {
    console.log("In /dislikeQuestion route");
    const question = await dislikeQuestion(req, res);
    console.log(question);
    res.json(question);
}));


// Answer routes
questionRouter.route("/answer/:questionId").post(asynchandler(async (req, res) => {
    console.log("In /answer route");
    const received = await answerQuestion(req, res);
    console.log(received);
    res.json(received);
}));

questionRouter.route("/likeAnswer/:questionId/:answerId").post(asynchandler(async (req, res) => {
    console.log("In /likeAnswer route");
    const answer = await likeAnswer(req, res);
    console.log(answer);
    res.json(answer);
}));

questionRouter.route("/dislikeAnswer/:questionId/:answerId").post(asynchandler(async (req, res) => {
    console.log("In /dislikeAnswer route");
    const answer = await dislikeAnswer(req, res);
    console.log(answer);
    res.json(answer);
}));

export default questionRouter;