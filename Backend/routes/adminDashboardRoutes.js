import express from "express";

import {
  getDashboardSummary,
} from "../controllers/dashboardController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  adminMiddleware,
  getDashboardSummary
);

export default router;