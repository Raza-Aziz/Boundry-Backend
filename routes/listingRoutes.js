import express from "express";
import {
  getAllListings,
  createListing,
  getListing,
  deleteListing,
  updateListing,
} from "../controllers/listingController.js";
import checkOwnership from "../middleware/ownership.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAllListings).post(authenticateToken, createListing);
router
  .route("/:id")
  .get(checkOwnership, getListing)
  .put(checkOwnership, updateListing)
  .delete(checkOwnership, deleteListing);
