import express from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume
} from "../controllers/resume.controller.js";
const router = express.Router();

//유저 이력서
router.post("/resume", authorizeUser, createResume);
router.get("/resume", authorizeUser, getResumes);
router.get("/resume/:resumeId", authorizeUser, getResume);
router.patch("/resume/:resumeId", authorizeUser, updateResume);
router.delete("/resume/:resumeId", authorizeUser, deleteResume);

export default router;
