import express from "express";
import { getUser } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

//자기 정보 조회
router.get("/user", authenticateUser, getUser);

export default router;
