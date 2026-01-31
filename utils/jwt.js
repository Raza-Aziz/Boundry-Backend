import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// TODO: Set Tokens as HTTP-only cookies

export const generateAccessToken = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_KEY, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV,
    maxAge: 1000 * 60 * 60,
  });
};

export const generateRefreshToken = (res, userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
};

export const verifyAccessToken = (token) => {
  try {
    const isVerified = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    return isVerified;
  } catch (e) {
    console.error(`Access Token Verification failed :: ${e.message}`);
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
