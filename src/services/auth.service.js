import { prisma } from "../utils/prisma/prisma.util.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";

import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt/jwt.js";

// 해당 유저가 존재하는 지 확인 하는 함수.
export const checkUserExists = async (email) => {
  const user = await prisma.user.findFirst({ where: { email } });
  //!! 를 사용 함으로 명시작으로 boolean 값을 돌려줄수있음
  return user;
};
//유저 생성 함수.
export const createUser = async (user) => {
  const isExitsUser = await checkUserExists(user.email);
  if (isExitsUser) {
    throw new ErrorHandler(400, "이미 존재하는 유저입니다.");
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: user.email,
        password: hashedPassword
      }
    });

    const newUserInfo = await tx.user_info.create({
      data: {
        user_id: newUser.user_id,
        username: user.username,
        age: +user.age,
        gender: user.gender
      }
    });
    const { password, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword
    };
  });
};
//유저 로그인 인증 함수
export const authenticateUser = async (user) => {
  const isExitsUser = await checkUserExists(user.email);
  console.log(isExitsUser.password, user.password);
  if (!isExitsUser || !(await bcrypt.compare(user.password, isExitsUser.password))) {
    throw new ErrorHandler(401, "인증 정보가 유효하지 않습니다.");
  }
  const accessToken = generateAccessToken(isExitsUser.user_id);
  return accessToken;
};
