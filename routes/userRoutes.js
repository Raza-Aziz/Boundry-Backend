import express from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/me")
  .get(authenticateToken, getCurrentUserProfile)
  .put(authenticateToken, updateProfile);
