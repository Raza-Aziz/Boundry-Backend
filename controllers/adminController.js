import Listing from "../models/listingModel";

export const getuserPendingListings = async (req, res) => {
  // get all the listings that are unapproved

  // skip and limit for pagination
  // we can get limit and page from frontend as req.query
  const page = req.query.page || 1;
  const limit = req.query.limit;

  const finalLimit = Math.ceil(limit, 100);
  const skip = (page - 1) * finalLimit;

  const filter = { isApproved: false };

  // for that, we can use the .find() method with {isApproved: false
  const pendingListings = await Listing.find(filter)
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
