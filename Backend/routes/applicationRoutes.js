import express from "express";

import { applyForJob,getMyApplications,getApplicationById} from "../controllers/applicationController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  applyForJob
);
router.get(
  "/",
  authMiddleware,
  getMyApplications
);
router.get(
  "/:id",
  authMiddleware,
  getApplicationById
);



export default router;