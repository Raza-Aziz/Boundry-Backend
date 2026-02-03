import express from "express";
import {
  getAllListings,
  createListing,
  getListing,
  deleteListing,
  updateListing,
} from "../controllers/listingController.js";
import checkOwnership from "../middleware/ownership.js";

const router = express.Router();

router.route("/").get(getAllListings).post(createListing);
router
  .route("/:id")
  .get(getListing)
  .put(checkOwnership, updateListing)
  .delete(checkOwnership, deleteListing);
