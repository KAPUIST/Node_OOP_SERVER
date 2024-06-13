import STATUS_CODES from "../utils/statusCode.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";

export default class UserController {
  constructor(authService) {
    this.authService = authService;
  }

  findUserById = async (req, res, next) => {
    try {
      const user = await this.authService.findUserInfoById(req.user.user_id);
      if (!user) {
        throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "유저를 찾을수 없습니다.");
      }

      res.status(STATUS_CODES.OK).json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  };
}
