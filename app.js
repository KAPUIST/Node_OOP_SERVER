import express from "express";
import dotenv from "dotenv";
import STATUS_CODES from "./utils/statusCode.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import connectDatabase from "./utils/prisma/prisma.util.js";
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
await connectDatabase();
app.use((req, res, next) => {
  res.status(STATUS_CODES.NOT_FOUND).send("해당페이지를 찾을 수 없습니다.");
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
