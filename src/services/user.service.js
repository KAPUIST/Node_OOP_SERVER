import { prisma } from "../utils/prisma/prisma.util.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import STATUS_CODES from "../utils/statusCode.js";

// 해당 유저가 존재하는 지 확인 하는 함수.
export const getUserById = async (userId) => {
  const user = await prisma.user.findFirst({
    where: { user_id: userId },
    select: {
      user_id: true,
      email: true,
      created_at: true,
      updated_at: true,
      user_info: {
        select: {
          role: true,
          username: true
        }
      }
    }
  });
  if (!user) {
    throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "유저를 찾을수 없습니다.");
  }

  return user;
};
