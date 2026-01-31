import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.route("/").post(register);
router.route("/login").post(login);
router.route("/profile").get(authenticateToken, getCurrentUser);
