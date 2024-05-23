import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
const router = express.Router();

//유저 회원가입
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
export default router;
