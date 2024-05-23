import { AsyncErrorHandler } from "../middlewares/asyncError.middleware.js";
import STATUS_CODES from "../utils/statusCode.js";

import { getUserById } from "../services/user.service.js";

//유저 생성 컨트롤러
export const getUser = AsyncErrorHandler(async (req, res, next) => {
  try {
    const user = await getUserById(req.user.user_id);

    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: user
    });
  } catch (error) {
    next(error);
  }
});
