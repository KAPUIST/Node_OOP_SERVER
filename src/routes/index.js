import express from "express";
import AuthRouter from "./auth.router.js";
import UserRouter from "./user.router.js";
import ResumeRouter from "./resume.router.js";
const router = express.Router();

router.use("/auth/", AuthRouter);
router.use("/users/", UserRouter);
router.use("/resumes/", ResumeRouter);
export default router;
