import express from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import {
  createResume,
  updateResume,
  deleteResume,
  getResumesForAPPLICANT,
  getResumesForRECRUITER,
  getResumeForAPPLICANT,
  getResumeForRECRUITER
} from "../controllers/resume.controller.js";
const router = express.Router();

//유저 이력서
router.post("/resume", authorizeUser, createResume);
router.get("/resume", authorizeUser, (req, res, next) => {
  console.log(req.user.role);
  if (req.user.role === "RECRUITER") {
    getResumesForRECRUITER(req, res, next);
  } else {
    getResumesForAPPLICANT(req, res, next);
  }
});
router.get("/resume/:resumeId", authorizeUser, (req, res, next) => {
  console.log(req.user.role);
  if (req.user.role === "RECRUITER") {
    getResumeForRECRUITER(req, res, next);
  } else {
    getResumeForAPPLICANT(req, res, next);
  }
});
router.patch("/resume/:resumeId", authorizeUser, updateResume);
router.delete("/resume/:resumeId", authorizeUser, deleteResume);

export default router;
