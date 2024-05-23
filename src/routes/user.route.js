import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { authorizationUser } from "../middlewares/auth.meddleware.js";
const router = express.Router();

//유저 회원가입
router.get("/user", authorizationUser, registerUser);

export default router;
