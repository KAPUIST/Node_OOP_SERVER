import express from "express";
import { loginUser, logoutUser, refreshAuthToken, registerUser } from "../controllers/auth.controller.js";
import { authenticateRefreshToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

//유저 회원가입
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/token", authenticateRefreshToken, refreshAuthToken);
router.delete("/auth/logout", authenticateRefreshToken, logoutUser);
export default router;
