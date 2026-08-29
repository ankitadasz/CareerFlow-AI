import express from "express";

import {
  getDashboardSummary,
  getJobStats,
  getApplicationStats
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
router.get(
  "/job-stats",
  authMiddleware,
  adminMiddleware,
  getJobStats
);
router.get(
  "/application-stats",
  authMiddleware,
  adminMiddleware,
  getApplicationStats
);



export default router;