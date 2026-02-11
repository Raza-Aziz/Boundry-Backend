import Listing from "../models/listingModel.js";

const checkOwnership = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate("createdBy");

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  req.listing = listing;

  if (listing.isApproved) {
    return next();
  }

  // else if not approved
  // check if user is logged in
  if (req.user) {
    // check if user is ADMIN || CREATOR of listing
    if (req.user.isAdmin === true || listing.createdBy.equals(req.user._id)) {
      return next();
    }
  }

  // else if not logged in
  return res.status(403).json({ message: "Access denied." });
};

export default checkOwnership;
