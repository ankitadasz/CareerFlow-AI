import express from "express";

import { createJob,getAllJobs,getJobById,updateJob,deleteJob } from "../controllers/jobController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createJob
);
router.get("/",authMiddleware,getAllJobs);
router.get("/:id",authMiddleware,getJobById);
router.patch("/:id",authMiddleware,adminMiddleware,updateJob);
router.delete("/:id",authMiddleware,adminMiddleware,deleteJob);


export default router;