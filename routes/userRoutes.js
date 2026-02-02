import express from "express";
import { authenticateToken, authorizeAdmin } from "../middleware/auth.js";
import {
  updateProfile,
  getCurrentUserProfile,
  getUserPublicProfile,
} from "../controllers/userController.js";

const router = express.Router();

router
  .route("/me")
  .get(authenticateToken, getCurrentUserProfile)
  .put(authenticateToken, updateProfile);

// ! : Doesn't need authenticateToken middleware cause viewing PUBLIC profile
router.route("/:id").get(getUserPublicProfile);
