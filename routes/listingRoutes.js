import express from "express";
import {
  getAllPublicListings,
  createListing,
  getListing,
  deleteListing,
  updateListing,
  getUserListings,
} from "../controllers/listingController.js";
import checkOwnership from "../middleware/ownership.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.route("/").get(getAllPublicListings);
router.post("/", authenticateToken, upload.array("images", 10), createListing);

// TODO: Make a route to GET all pending listings for logged-in user
router.route("/my-listings").get(authenticateToken, getUserListings);
router
  .route("/:id")
  .get(checkOwnership, getListing)
  .put(checkOwnership, updateListing)
  .delete(checkOwnership, deleteListing);

// TODO: Create /stats endpoint using MongoDB Aggregation for Dashboard insights (Module 4.4)
