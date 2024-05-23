import { AsyncErrorHandler } from "../middlewares/asyncError.middleware.js";
import { loginValidation, registerValidation } from "../utils/validation/auth.validation.js";
import { createUser, authenticateUser } from "../services/auth.service.js";
import STATUS_CODES from "../utils/statusCode.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";

//유저 생성 컨트롤러
export const registerUser = AsyncErrorHandler(async (req, res, next) => {
  try {
    const validateData = await registerValidation.validateAsync(req.body);
    const user = await createUser(validateData);
    res.status(STATUS_CODES.CREATED).json({
      statusCode: STATUS_CODES.CREATED,
      data: user
    });
  } catch (error) {
    if (error.isJoi) {
      next(new ErrorHandler(STATUS_CODES.BAD_REQUEST, error.message));
    }
    next(error);
  }
});
//유저 로그인 컨트롤러
export const loginUser = AsyncErrorHandler(async (req, res, next) => {
  const validateData = await loginValidation.validateAsync(req.body);
  const accessToken = await authenticateUser(validateData);

  res.cookie("authorization", `Bearer ${accessToken}`);
  res.status(STATUS_CODES.OK).json({
    status: STATUS_CODES.OK,
    accessToken: accessToken
  });
});
