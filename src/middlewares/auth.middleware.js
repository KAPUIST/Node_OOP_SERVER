import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import { verifyAccessToken } from "../utils/jwt/jwt.js";
import { prisma } from "../utils/prisma/prisma.util.js";

export const authorizeUser = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req.headers);

    req.user = await getUserFromToken(token);
    next();
  } catch (error) {
    res.clearCookie("authorization");
    next(error);
  }
};

const getUserFromToken = async (token) => {
  const decodedToken = verifyAccessToken(token);
  const userId = decodedToken.user_id;

  const user = await prisma.user.findFirst({ where: { user_id: userId } });
  if (!user) {
    throw new ErrorHandler(401, "인증 정보와 일치하는 사용자가 없습니다.");
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
const getTokenFromHeaders = (headers) => {
  const authorization = headers["authorization"];

  if (!authorization) {
    throw new ErrorHandler(401, "인증 정보가 없습니다.");
  }
  const decodedAuthorization = decodeURIComponent(authorization);

  const [tokenType, token] = decodedAuthorization.split(" ");
  if (tokenType !== "Bearer") {
    throw new ErrorHandler(401, "지원하지 않는 인증 방식입니다.");
  }
  return token;
};
