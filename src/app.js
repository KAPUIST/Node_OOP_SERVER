import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import STATUS_CODES from "./utils/statusCode.js";
import { CustomErrorHandler } from "./middlewares/error.middleware.js";
import { connectDatabase } from "./utils/prisma/prisma.util.js";
import router from "./routes/index.js";

import { SERVER_PORT } from "./constants/env.constant.js";
dotenv.config();

const app = express();
const PORT = SERVER_PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//DB 커넥션
await connectDatabase();

//라우터
app.use("/api", router);

app.use("/api/health", (req, res, next) => {
  res.status(STATUS_CODES.OK).send("ping");
});
app.use((req, res, next) => {
  res.status(STATUS_CODES.NOT_FOUND).send("해당페이지를 찾을 수 없습니다.");
});

app.use(CustomErrorHandler);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
