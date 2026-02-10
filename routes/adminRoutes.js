import express from "express";
import { authorizeAdmin } from "../middleware/auth";

const router = express.Router();

router.route("/listings/pending").get(authorizeAdmin, getUserPendingListings);
router.route("/listings/:id/approve").patch(authorizeAdmin, approveUserListing);
router.route("/listings/:id/reject").patch(authorizeAdmin, rejectUserListing);
router.route("/listings/:id").delete(authorizeAdmin, deleteUserListing);
