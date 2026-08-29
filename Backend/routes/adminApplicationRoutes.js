import express from "express";
import { getAdminApplicationById, getAllApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, adminMiddleware, getAllApplications);
router.get("/:id", authMiddleware, adminMiddleware,getAdminApplicationById);
router.patch("/:id/status", authMiddleware, adminMiddleware,updateApplicationStatus);



export default router;
