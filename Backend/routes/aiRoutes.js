import express from "express";

import { analyzeResume } from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/analyze-resume",
  authMiddleware,
  analyzeResume
);

export default router;