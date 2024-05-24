import jwt from "jsonwebtoken";
const options = {
  accessSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  accessOption: { expiresIn: "12h" },
  refreshSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
  refreshOption: { expiresIn: "7d" }
};
export const generateAccessToken = (userId) => {
  return jwt.sign({ user_id: userId }, options.accessSecretKey, options.accessOption);
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, options.accessSecretKey);
};
export const generateRefreshToken = (userId) => {
  return jwt.sign({ user_id: userId }, options.refreshSecretKey, options.refreshOption);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, options.refreshSecretKey);
};
