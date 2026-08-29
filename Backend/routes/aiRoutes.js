import express from "express";
import { analyzeResume } from "../controllers/aiController.js";
import {
  startInterview,
  submitInterviewAnswer,
  getNextInterviewQuestion,
  getInterviewResult,
   getMyInterviews,
  getInterviewById,
} from "../controllers/interviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/analyze-resume",
  authMiddleware,
  analyzeResume
);
router.post(
  "/interview/start",
  authMiddleware,
  startInterview
);
router.post(
  "/interview/answer",
  authMiddleware,
  submitInterviewAnswer
);
router.post(
  "/interview/next",
  authMiddleware,
  getNextInterviewQuestion
);
router.post(
  "/interview/result",
  authMiddleware,
  getInterviewResult
);
router.get(
  "/interviews",
  authMiddleware,
  getMyInterviews
);

router.get(
  "/interviews/:id",
  authMiddleware,
  getInterviewById
);
export default router;