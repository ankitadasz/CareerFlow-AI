import express from "express";

import { analyzeResume, startInterview,submitInterviewAnswer } from "../controllers/aiController.js";
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
export default router;