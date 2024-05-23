import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler/errorHandler";
import { verifyAccessToken } from "../utils/jwt/jwt";
import { prisma } from "../utils/prisma/prisma.util";
export const authorizationUser = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return next(new ErrorHandler(401, "인증 정보가 없습니다."));
    }
    const [tokenType, token] = authorization.split(" ");
    console.log(tokenType);
    if (tokenType !== "Bearer") return next(new ErrorHandler(401, "토큰 타입이 일치하지 않습니다."));

    const decodedToken = verifyAccessToken(token);
    const userId = decodedToken.user_id;

    const user = await prisma.user.findFirst({ where: { user_id: userId } });

    if (!user) {
      res.clearCookie("authorization");
      return next(new ErrorHandler(401, "사용자가 존재하지 않습니다."));
    }
    const { password, ...userWithoutPassword } = newUser;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    next(error);
  }
};
