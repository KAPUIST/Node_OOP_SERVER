import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import STATUS_CODES from "./utils/statusCode.js";
import { CustomErrorHandler } from "./middlewares/error.middleware.js";
import { connectDatabase } from "./utils/prisma/prisma.util.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
await connectDatabase();
app.use("/api", [authRouter, userRouter]);

app.use((req, res, next) => {
  res.status(STATUS_CODES.NOT_FOUND).send("해당페이지를 찾을 수 없습니다.");
});

app.use(CustomErrorHandler);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
