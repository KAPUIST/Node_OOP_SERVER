import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwtOption } from "../../constants/jwt.constant.js";
export default class JwtService {
  generateAccessToken = (userId) => {
    return jwt.sign({ user_id: userId }, jwtOption.accessSecretKey, jwtOption.accessOption);
  };

  verifyAccessToken = (token) => {
    return jwt.verify(token, jwtOption.accessSecretKey);
  };
  generateRefreshToken = (userId) => {
    return jwt.sign({ user_id: userId }, jwtOption.refreshSecretKey, jwtOption.refreshOption);
  };

  verifyRefreshToken = (token) => {
    return jwt.verify(token, jwtOption.refreshSecretKey);
  };

  hashedToken = (token) => {
    console.log(token);
    return crypto.createHash("sha256").update(token).digest("hex");
  };
}
