import User from "../models/userModel.js";
import { hashPassword } from "../utils/bcrypt.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getCurrentUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("username email phone avatar")
    .populate("listings"); // to include listingCount virtual

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // TODO: Check for updating avatar too
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        user.avatar = {
          url: cloudinaryResponse.url.replace(
            "/upload/",
            "/upload/f_auto,q_auto/",
          ),
          publicId: cloudinaryResponse.publicId,
        };
      }
    }

    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }

    const updatedUser = await user.save();

    console.log(req.body);
    console.log(user.avatar.url);
    console.log(req.file);

    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const getUserPublicProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("username createdAt avatar")
    .populate("listings");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
