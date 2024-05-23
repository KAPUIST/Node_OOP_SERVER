// 에러 핸들링 미들웨어
import statusCode from "../utils/statusCode.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";
export function CustomErrorHandler(error, req, res, next) {
  console.error(error);
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.";

  //토큰 에러
  if (error.name === "JsonWebTokenError") {
    const message = "인증 정보가 유효하지 않습니다.";
    error = new ErrorHandler(401, message);
  }

  //토큰 만료
  if (error.name === "TokenExpiredError") {
    const message = `인증 정보가 만료되었습니다.`;
    error = new ErrorHandler(401, message);
  }
  res.status(error.statusCode).json({
    success: "false",
    message: error.message
  });
}
