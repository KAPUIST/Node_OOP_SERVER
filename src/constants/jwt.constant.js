import "dotenv/config";

export const jwtOption = {
  accessSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  accessOption: { expiresIn: "12h" },
  refreshSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
  refreshOption: { expiresIn: "7d" }
};
