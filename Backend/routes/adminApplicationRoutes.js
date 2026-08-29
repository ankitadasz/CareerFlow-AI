import express from "express";
import { getAdminApplicationById, getAllApplications } from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, adminMiddleware, getAllApplications);
router.get("/:id", authMiddleware, adminMiddleware,getAdminApplicationById);

export default router;
