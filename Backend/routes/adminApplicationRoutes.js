import express from "express";
import { getAllApplications } from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, adminMiddleware, getAllApplications);
export default router;
