import express from 'express';
import { buyCourse, updateProgress } from '../controllers/courseControllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/buy', verifyJWT, buyCourse);
router.post('/progress', verifyJWT, updateProgress);

export default router;
