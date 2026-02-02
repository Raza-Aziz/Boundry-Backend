import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  // ! Remember : Fields are set by objects
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // To get unique emails
    lowercase: true, // To save emails in lowercase
    trim: true, // To trim any whitespaces (my habit)
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be 8 characters long"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+?[1-9][0-9]{7,14}$/, "Please enter a valid Phone number"],
    // NOTE: Alternative regex format
    // match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid Phone number"],
    trim: true,
  },
  avatar: {
    url: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/cust-background-icon/default-avatar-3.png",
    },
    publicId: { type: String, default: "" },
  },
  // updatedAt: {}
});

userSchema.virtual("listings", {
  ref: "Listing",
  count: true,
  localField: "_id",
  foreignField: "owner",
});

// Creating index
userSchema.index({ email: 1 }, { unique: true }); // email index for normal uses as unique email
userSchema.index({ username: 1 }, { unique: true }); // username index for speed in login
userSchema.index({ isAdmin: 1 }); // isAdmin index for admin dashboard

// to include virtuals in res.json(), when sending to frontend
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;
