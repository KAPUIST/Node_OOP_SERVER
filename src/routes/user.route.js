import express from "express";
import { getUser } from "../controllers/user.controller.js";
import { authorizeUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

//유저 회원가입
router.get("/user", authorizeUser, getUser);

export default router;