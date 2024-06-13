import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import ResumeController from "../controllers/resume.controller.js";
import ResumeService from "../services/resume.service.js";
import ResumesRepository from "../repositories/resumes.repository.js";
import AuthService from "../services/auth.service.js";
import UserRepository from "../repositories/users.repository.js";
import JwtService from "../utils/jwt/jwt.js";
import { prisma } from "../utils/prisma/prisma.util.js";
import {
  resumeValidator,
  updateResumeStatusValidator,
  updateResumeValidator
} from "../utils/validation/resume.validation.js";
const jwtService = new JwtService();
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository, jwtService);
const resumeRepository = new ResumesRepository(prisma);
const resumeService = new ResumeService(resumeRepository);
const resumeController = new ResumeController(resumeService);
const authMiddleware = new AuthMiddleware(authService, jwtService);

const router = express.Router();

//유저 이력서
router.post("/", resumeValidator, authMiddleware.authenticateUser, resumeController.createResume);
router.get(
  "/",
  authMiddleware.authenticateUser,
  authMiddleware.requireRoles(["APPLICANT", "RECRUITER"]),
  (req, res, next) => {
    if (req.user.role === "RECRUITER") {
      resumeController.findAllResumesForRECRUITER(req, res, next);
    } else {
      resumeController.findAllResumesForAPPLICANT(req, res, next);
    }
  }
);
router.get(
  "/:resumeId",
  authMiddleware.authenticateUser,
  authMiddleware.requireRoles(["APPLICANT", "RECRUITER"]),
  (req, res, next) => {
    if (req.user.role === "RECRUITER") {
      resumeController.findResumeForRECRUITERByResumeId(req, res, next);
    } else {
      resumeController.findResumeForAPPLICANTByResumeId(req, res, next);
    }
  }
);
router.patch("/:resumeId", updateResumeValidator, authMiddleware.authenticateUser, resumeController.updateResume);
router.delete("/:resumeId", authMiddleware.authenticateUser, resumeController.deleteResume);
router.patch(
  "/:resumeId/status",
  authMiddleware.authenticateUser,
  authMiddleware.requireRoles(["RECRUITER"]),
  updateResumeStatusValidator,
  resumeController.updateResumeStatus
);
router.get(
  "/:resumeId/logs",
  authMiddleware.authenticateUser,
  authMiddleware.requireRoles(["RECRUITER"]),
  resumeController.getUpdatedResumeLog
);

export default router;
