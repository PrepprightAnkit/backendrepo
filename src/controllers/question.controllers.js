import { Question } from "../models/questions.models.js";

// Create a new question
const askQuestion = async (req, res) => {
  try {
    const { questionText } = req.body;

    const newQuestion = new Question({
      questionText,
    });

    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Answer a question
const answerQuestion = async (req, res) => {
  try {
    const { questionId, answerText } = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newAnswer = {
      answerText,
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a question
const likeQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.likes += 1;
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike a question
const dislikeQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.dislikes += 1;
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like an answer
const likeAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    answer.likes += 1;
    await question.save();

    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike an answer
const dislikeAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    answer.dislikes += 1;
    await question.save();

    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get public questions
const getQuestionsPublic = async (req, res) => {
  try {
    const questions = await Question.find()
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  askQuestion,
  answerQuestion,
  likeQuestion,
  dislikeQuestion,
  likeAnswer,
  dislikeAnswer,
  getQuestionsPublic,
};