import express from "express";
import { authenticateUser, requireRoles } from "../middlewares/auth.middleware.js";
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
router.post("/resume", authenticateUser, createResume);
router.get("/resume", authenticateUser, requireRoles(["APPLICANT", "RECRUITER"]), (req, res, next) => {
  if (req.user.role === "RECRUITER") {
    getResumesForRECRUITER(req, res, next);
  } else {
    getResumesForAPPLICANT(req, res, next);
  }
});
router.get("/resume/:resumeId", authenticateUser, requireRoles(["APPLICANT", "RECRUITER"]), (req, res, next) => {
  if (req.user.role === "RECRUITER") {
    getResumeForRECRUITER(req, res, next);
  } else {
    getResumeForAPPLICANT(req, res, next);
  }
});
router.patch("/resume/:resumeId", authenticateUser, updateResume);
router.delete("/resume/:resumeId", authenticateUser, deleteResume);
router.patch("/resume/:resumeId/status", authenticateUser, requireRoles(["RECRUITER"]), updateResumeStatus);
router.get("/resume/:resumeId/logs", authenticateUser, requireRoles(["RECRUITER"]), getUpdatedResumeLog);

export default router;
