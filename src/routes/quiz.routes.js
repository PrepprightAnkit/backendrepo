import express from "express";
import {
  createQuiz,
  deleteQuiz,
  createQuestion,
  createOption,
  updateQuestions,
  updateOptions,
  getAllQuizzes,
  getAllQuestions,
  submitQuiz
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.post("/quizzes", createQuiz);
router.get("/quizzes", getAllQuizzes); // Add this line
router.delete("/quizzes/:id", deleteQuiz);
router.post("/quizzes/questions", createQuestion);
router.post("/quizzes/options", createOption);
router.put("/quizzes/upquestions", updateQuestions);
router.put("/quizzes/questions/options", updateOptions);
router.post("/quizzes/getallquestions", getAllQuestions);
router.post("/quizzes/submit", submitQuiz);


export default router;
