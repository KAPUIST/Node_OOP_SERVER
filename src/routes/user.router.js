import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import UserController from "../controllers/user.controller.js";
import JwtService from "../utils/jwt/jwt.js";
import { prisma } from "../utils/prisma/prisma.util.js";
import AuthService from "../services/auth.service.js";
import UsersRepository from "../repositories/users.repository.js";
const router = express.Router();
const jwtService = new JwtService(prisma);
const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository);
const authMiddleware = new AuthMiddleware(authService, jwtService);
const usersController = new UserController(authService);
//자기 정보 조회
router.get("/me", authMiddleware.authenticateUser, usersController.findUserById);

export default router;
