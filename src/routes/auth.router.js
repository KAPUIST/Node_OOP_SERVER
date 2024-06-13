import express from "express";
import UsersRepository from "../repositories/users.repository.js";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";
import { prisma } from "../utils/prisma/prisma.util.js";
import JwtService from "../utils/jwt/jwt.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const jwtService = new JwtService();
const authService = new AuthService(usersRepository, jwtService);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authService, jwtService);
router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.get("/refreshToken", authMiddleware.authenticateRefreshToken, authController.refreshAuthToken);
router.delete("/logout", authMiddleware.authenticateRefreshToken, authController.logout);

export default router;
