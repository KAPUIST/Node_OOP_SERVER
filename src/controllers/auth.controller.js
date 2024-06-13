import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import STATUS_CODES from "../utils/statusCode.js";
//유저 생성 컨트롤러
export default class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  createUser = async (req, res, next) => {
    try {
      const userInputData = req.body;
      const isExistsUser = await this.authService.findUserByEmail(userInputData.email);
      if (isExistsUser) throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "이미 존재하는 이메일 입니다.");
      const newUser = await this.authService.createUser(userInputData);
      res.status(STATUS_CODES.CREATED).json({ newUser });
    } catch (error) {
      next(error);
    }
  };
  loginUser = async (req, res, next) => {
    try {
      const userInputData = req.body;
      const user = await this.authService.findUserByEmail(userInputData.email);

      if (!user) throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "유저가 존재하지 않습니다.");
      const checkPassword = await this.authService.comparePassword(userInputData.password, user.password);

      if (!checkPassword) {
        throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "비밀번호가 일치 하지 않습니다.");
      }
      const token = await this.authService.authenticateUser(user.user_id);
      res.cookie("accessToken", `Bearer ${token.accessToken}`);
      res.cookie("refreshToken", `Bearer ${token.refreshToken}`);
      res.sendStatus(STATUS_CODES.OK);
    } catch (error) {
      next(error);
    }
  };
  refreshAuthToken = async (req, res, next) => {
    try {
      const token = this.authService.authenticateUser(req.user.user_id);
      res.cookie("accessToken", `Bearer ${token.accessToken}`);
      res.cookie("refreshToken", `Bearer ${token.refreshToken}`);
      res.status(STATUS_CODES.OK).json({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      });
    } catch (error) {
      next(error);
    }
  };
  logout = async (req, res, next) => {
    try {
      const deleted = await this.authService.deleteUserToken(req.user.user_id);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        user_id: deleted.user_id
      });
    } catch (error) {
      next(error);
    }
  };
}
