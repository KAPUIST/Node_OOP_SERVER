import { asyncErrorHandler } from "../middlewares/asyncError.middleware.js";
import { loginValidation, registerValidation } from "../utils/validation/auth.validation.js";
import { createUser, authenticateUser, regenerateToken, deleteUserToken } from "../services/auth.service.js";
import STATUS_CODES from "../utils/statusCode.js";
//유저 생성 컨트롤러
export const registerUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const validateData = await registerValidation.validateAsync(req.body);
    const user = await createUser(validateData);
    res.status(STATUS_CODES.CREATED).json({
      statusCode: STATUS_CODES.CREATED,
      data: user
    });
  } catch (error) {
    next(error);
  }
});
//유저 로그인 컨트롤러
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const validateData = await loginValidation.validateAsync(req.body);
    const [accessToken, refreshToken] = await authenticateUser(validateData);

    res.cookie("accessToken", `Bearer ${accessToken}`);
    res.cookie("refreshToken", `Bearer ${refreshToken}`);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

export const refreshAuthToken = asyncErrorHandler(async (req, res, next) => {
  try {
    const [accessToken, refreshToken] = await regenerateToken(req.user.user_id);

    res.cookie("accessToken", `Bearer ${accessToken}`);
    res.cookie("refreshToken", `Bearer ${refreshToken}`);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

export const logoutUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const deleted = await deleteUserToken(req.user.user_id);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      user_id: deleted.user_id
    });
  } catch (error) {
    next(error);
  }
});
