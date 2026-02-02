import User from "../models/userModel";
import { hashPassword } from "../utils/bcrypt.js";

const getCurrentUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("username email phone avatar")
    .populate("listings"); // to include listingCount virtual

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    // TODO: Check for updating avatar too
    // if (req.body.avatar) {
    //   user.avatar.url = req.body.avatar.url || user.avatar.url;
    //   user.avatar.publicId = req.body.avatar.publicId || user.avatar.publicId;
    // }

    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getUserPublicProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("username createdAt avatar")
    .populate("listings");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export default { getCurrentUserProfile, updateProfile, getUserPublicProfile };
