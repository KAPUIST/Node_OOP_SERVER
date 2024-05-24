import express from "express";
import { authorizeUser, requireRoles } from "../middlewares/auth.middleware.js";
import {
  createResume,
  updateResume,
  deleteResume,
  getResumesForAPPLICANT,
  getResumesForRECRUITER,
  getResumeForAPPLICANT,
  getResumeForRECRUITER,
  updateResumeStatus,
  getUpdatedResumeLog
} from "../controllers/resume.controller.js";
const router = express.Router();

//유저 이력서
router.post("/resume", authorizeUser, createResume);
router.get("/resume", authorizeUser, requireRoles(["APPLICANT", "RECRUITER"]), (req, res, next) => {
  if (req.user.role === "RECRUITER") {
    getResumesForRECRUITER(req, res, next);
  } else {
    getResumesForAPPLICANT(req, res, next);
  }
});
router.get("/resume/:resumeId", authorizeUser, requireRoles(["APPLICANT", "RECRUITER"]), (req, res, next) => {
  if (req.user.role === "RECRUITER") {
    getResumeForRECRUITER(req, res, next);
  } else {
    getResumeForAPPLICANT(req, res, next);
  }
});
router.patch("/resume/:resumeId", authorizeUser, updateResume);
router.delete("/resume/:resumeId", authorizeUser, deleteResume);
router.patch("/resume/:resumeId/status", authorizeUser, requireRoles(["RECRUITER"]), updateResumeStatus);
router.get("/resume/:resumeId/logs", authorizeUser, requireRoles(["RECRUITER"]), getUpdatedResumeLog);

export default router;
