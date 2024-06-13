import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import STATUS_CODES from "../utils/statusCode.js";

export default class AuthMiddleware {
  constructor(authService, jwtService) {
    this.authService = authService;
    this.jwtService = jwtService;
  }
  #getTokenFromHeaders = (headers) => {
    const authorization = headers["authorization"];
    if (!authorization) {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보가 없습니다.");
    }
    const decodedAuthorization = decodeURIComponent(authorization);
    const [tokenType, token] = decodedAuthorization.split(" ");
    if (tokenType !== "Bearer") {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "지원하지 않는 인증 방식입니다.");
    }
    return token;
  };
  #getUserFromToken = async (token) => {
    const decodedToken = this.jwtService.verifyAccessToken(token);
    const userId = decodedToken.user_id;
    if (!userId) {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보와 일치하는 사용자가 없습니다.");
    }

    const user = await this.authService.findUserById(userId);
    if (!user) {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보와 일치하는 사용자가 없습니다.");
    }

    const formattedData = {
      user_id: user.user_id,
      role: user.user_info.role
    };

    return formattedData;
  };
  authenticateUser = async (req, res, next) => {
    try {
      const token = this.#getTokenFromHeaders(req.headers);
      req.user = await this.#getUserFromToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };
  #getUserFromRefreshToken = async (token) => {
    const decodedToken = this.jwtService.verifyRefreshToken(token);
    const userId = decodedToken.user_id;
    if (!userId) {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보가 없습니다.");
    }

    const user = await this.authService.findUserAndTokenById(userId);

    if (!user) {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보와 일치하는 사용자가 없습니다.");
    }

    if (!user.user_refresh_token) {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "인증 정보가 없습니다.");
    }

    const hashedRefreshToken = this.jwtService.hashedToken(token);

    if (hashedRefreshToken !== user.user_refresh_token.token) {
      throw new ErrorHandler(STATUS_CODES.UNAUTHORIZED, "폐기된 인증 정보입니다.");
    }
    const formattedData = {
      user_id: user.user_id
    };

    return formattedData;
  };
  authenticateRefreshToken = async (req, res, next) => {
    try {
      const token = this.#getTokenFromHeaders(req.headers);

      req.user = await this.#getUserFromRefreshToken(token);
      next();
    } catch (error) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      next(error);
    }
  };
  requireRoles = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new ErrorHandler(STATUS_CODES.FORBIDDEN, "접근권한이 존재하지않습니다.");
      }
      next();
    };
  };
}
