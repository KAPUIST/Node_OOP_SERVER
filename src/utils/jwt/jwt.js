import jwt from "jsonwebtoken";
const options = {
  accessSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  accessOption: { expiresIn: "12h" },
  refreshSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
  refreshOption: { expiresIn: "7d" }
};
export const generateAccessToken = (user) => {
  return jwt.sign({ user_id: user.user_id }, options.accessSecretKey, options.accessOption);
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, options.accessSecretKey);
};
