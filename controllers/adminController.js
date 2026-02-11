import Listing from "../models/listingModel";

export const getuserPendingListings = async (req, res) => {
  // get all the listings that are unapproved

  // skip and limit for pagination
  // we can get limit and page from frontend as req.query
  const page = req.query.page || 1;
  const limit = req.query.limit;

  const finalLimit = Math.min(limit, 100);
  const skip = (page - 1) * finalLimit;

  const filter = { isApproved: false };

  // for that, we can use the .find() method with {isApproved: false
  const pendingListings = await Listing.find(filter)
    // ? : Is .populate really necessary??
    .populate("createdBy", "username avatar phone email")
    .sort({
      createdAt: "asc",
    })
    .skip(skip)
    .limit(finalLimit);

  const totalPendingListings = await Listing.countDocuments(filter);

  if (totalPendingListings === 0) {
    return res.status(404).json({ message: "No listings found" });
  }

  if (pendingListings) {
    res.status(200).json({
      pendingListings,
      totalPendingListings,
      page,
      pages: Math.ceil(totalPendingListings / finalLimit),
    });
  } else {
    return res
      .status(500)
      .json({ message: "Server error fetching pending listings" });
  }
};

export const approveUserListing = async (req, res) => {
  try {
    const approvedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );

    res.status(200).json({
      message: "Listing approved successfully",
      listing: approvedListing,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Listing could not be approved :: ${error}` });
  }
};

export const rejectUserListing = async (req, res) => {
  try {
    const rejectedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true },
    );

    res.status(200).json({
      message: "Listing rejected successfully",
      listing: rejectedListing,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Listing could not be rejected :: ${error}` });
  }
};

export const deleteUserListing = async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
      return res
        .status(404)
        .json({
          message: "Listing not found. It may have already been deleted.",
        });
    }

    res.status(200).json({ message: "Listing successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: `Listing deletion failed :: ${error}` });
  }
};
