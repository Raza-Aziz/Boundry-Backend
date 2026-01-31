import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/userModel.js";

export const authenticateToken = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      // .userId because the payload in the token has userId and not anything else
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Token Authentication Failed :: Token not verified" });
    }
  } else {
    res
      .status(401)
      .json({ message: "Token Authentication Failed :: Token not found" });
  }
};

export const authorizeAdmin = async (req, res, next) => {
  // ! Remember : Middlewares share req, we assume that one middleware is already called in the controller
  // !  So don't call one middleware inside another
  if (req.user) {
    if (req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Access Denied :: Admin permissions required" });
    }
  } else {
    res.status(401).json({ message: "Authorization failed :: User not found" });
  }
};
