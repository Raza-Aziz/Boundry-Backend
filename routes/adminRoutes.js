import express from "express";
import { authenticateToken, authorizeAdmin } from "../middleware/auth";
import {
  getUserPendingListings,
  approveUserListing,
  rejectUserListing,
  deleteUserListing,
  getAllUsers,
  changeUserAdminStatus,
  deleteUser,
} from "../controllers/adminController";

const router = express.Router();

// ---INFO : ADMIN LISTING ROUTES---
router
  .route("/listings/pending")
  .get(authenticateToken, authorizeAdmin, getUserPendingListings);
router
  .route("/listings/:id/approve")
  .patch(authenticateToken, authorizeAdmin, approveUserListing);
router
  .route("/listings/:id/reject")
  .patch(authenticateToken, authorizeAdmin, rejectUserListing);
router
  .route("/listings/:id")
  .delete(authenticateToken, authorizeAdmin, deleteUserListing);

// ---INFO : ADMIN USER ROUTES---
router.route("/users").get(authenticateToken, authorizeAdmin, getAllUsers);
router
  .route("/users/:id/role")
  .patch(authenticateToken, authorizeAdmin, changeUserAdminStatus);
router
  .route("/users/:id")
  .delete(authenticateToken, authorizeAdmin, deleteUser);
