import { AsyncErrorHandler } from "../middlewares/asyncError.middleware.js";
import STATUS_CODES from "../utils/statusCode.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";

//유저 생성 컨트롤러
export const getUser = AsyncErrorHandler(async (req, res, next) => {
  try {
    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: user
    });
  } catch (error) {
    if (error.isJoi) {
      next(new ErrorHandler(STATUS_CODES.BAD_REQUEST, error.message));
    }
    next(error);
  }
});
