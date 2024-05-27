import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt/jwt.js";
import { prisma } from "../utils/prisma/prisma.util.js";
import STATUS_CODES from "../utils/statusCode.js";
import crypto from "crypto";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req.headers);
    req.user = await getUserFromToken(token);
    next();
  } catch (error) {
    res.clearCookie("authorization");
    next(error);
  }
};

export const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorHandler(STATUS_CODES.FORBIDDEN, "접근권한이 존재하지않습니다.");
    }
    next();
  };
};

export const authenticateRefreshToken = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req.headers);

    req.user = await getUserFromRefreshToken(token);
    next();
  } catch (error) {
    res.clearCookie("authorization");
    next(error);
  }
};
const getTokenFromHeaders = (headers) => {
  const authorization = headers["authorization"];
  if (!authorization) {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보가 없습니다.");
  }
  const decodedAuthorization = decodeURIComponent(authorization);
  const [tokenType, token] = decodedAuthorization.split(" ");
  if (tokenType !== "Bearer") {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "지원하지 않는 인증 방식입니다.");
  }
  return token;
};
const getUserFromToken = async (token) => {
  const decodedToken = verifyAccessToken(token);
  const userId = decodedToken.user_id;
  if (!userId) {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보와 일치하는 사용자가 없습니다.");
  }

  const user = await prisma.users.findFirst({
    where: { user_id: userId },
    select: {
      user_id: true,
      user_info: {
        select: {
          role: true
        }
      }
    }
  });
  if (!user) {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보와 일치하는 사용자가 없습니다.");
  }

  const formattedData = {
    user_id: user.user_id,
    role: user.user_info.role
  };

  return formattedData;
};
const getUserFromRefreshToken = async (token) => {
  const decodedToken = verifyRefreshToken(token);
  const userId = decodedToken.user_id;
  if (!userId) {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보가 없습니다.");
  }

  const user = await prisma.users.findFirst({
    where: { user_id: userId },
    select: {
      user_id: true,
      user_refresh_token: {
        select: {
          token: true
        }
      }
    }
  });
  if (!user) {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보와 일치하는 사용자가 없습니다.");
  }
  if (!user.user_refresh_token) {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보가 없습니다.");
  }

  const hashedRefreshToken = crypto.createHash("sha256").update(token).digest("hex");

  if (hashedRefreshToken !== user.user_refresh_token.token) {
    throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "폐기된 인증 정보입니다.");
  }
  const formattedData = {
    user_id: user.user_id
  };

  return formattedData;
};
