import { prisma } from "../utils/prisma/prisma.util.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";

// 해당 유저가 존재하는 지 확인 하는 함수.
export const getUserById = async (userId) => {
  const user = await prisma.user.findFirst({ where: { user_id: userId } });
  //!! 를 사용 함으로 명시작으로 boolean 값을 돌려줄수있음
  const [password, ...withOutPassword] = user;
  return withOutPassword;
};
