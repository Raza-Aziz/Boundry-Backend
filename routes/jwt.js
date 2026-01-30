import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "1h",
  });
  return accessToken;
};

export const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "30d",
  });
  return refreshToken;
};

export const verifyAccessToken = (token) => {
  try {
    const isVerified = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    return isVerified;
  } catch (e) {
    console.error(`Verification of Access Token failed :: ${e.message}`);
    return null; // So the server doesn't crash on error
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const isVerified = jwt.verify(token, process.env.JWT_REFRESH_KEY);
    return isVerified;
  } catch (e) {
    console.error(`Verification of Refresh Token failed :: ${e.message}`);
    return null; // So the server doesn't crash on error
  }
};
