import Listing from "../models/listingModel";
import User from "../models/userModel";

export const getUserPendingListings = async (req, res) => {
  // get all the listings that are unapproved

  // skip and limit for pagination
  // we can get limit and page from frontend as req.query
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

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

// TODO : Make one method for soft delete too
export const deleteUserListing = async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
      return res.status(404).json({
        message: "Listing not found. It may have already been deleted.",
      });
    }

    res.status(200).json({ message: "Listing successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: `Listing deletion failed :: ${error}` });
  }
};

export const getAllUsers = async (req, res) => {
  // I think , should include pagination, cause of many users
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const finalLimit = Math.min(limit, 100);

  const skip = (page - 1) * finalLimit;

  try {
    const [users, userCount] = await Promise.all([
      User.find({}).skip(skip).limit(finalLimit).select("-password"),
      User.countDocuments({}),
    ]);

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      users,
      userCount,
      page,
      pages: Math.ceil(userCount / finalLimit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeUserAdminStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.status(200).json({
      message: `User is now ${updatedUser.isAdmin ? "an Admin" : "a Regular User"}`,
      listing: user,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `User admin status could not be updated :: ${error}` });
  }
};

export const deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return res
      .status(404)
      .json({ message: "User could not be found to delete" });
  }

  res
    .status(200)
    .json({ message: "User successfully deleted", user: deletedUser });
};
