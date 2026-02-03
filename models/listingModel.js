import mongoose from "mongoose";

listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Price needs to be higher than 0"],
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
  },
  propertyType: {
    type: String,
    required: true,
    lowercase: true,
    enum: {
      values: ["house", "apartment", "villa", "studio", "office"],
      message: "{VALUE} is not a valid property type",
    },
  },
  status: {
    type: String,
    required: true,
    lowercase: true,
    enum: {
      values: ["for-sale", "for-rent"],
      message: "{VALUE} is not a valid status",
    },
    default: "for-sale",
  },
  bedrooms: {
    type: Number,
    required: true,
    min: [1, "There must be atleast 1 bedroom"],
  },
  bathrooms: {
    type: Number,
    required: true,
    min: [1, "There must be atleast 1 bathroom"],
  },
  // TODO: Check if Union SchemaType can be used to alter b/w SqFt and SqYds
  areaSqft: {
    type: Number,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      publicId: { type: String, required: true },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    // ! : No () with function, only reference
    default: Date.now,
  },
});

listingSchema.index({ price: 1 });
listingSchema.index({ propertyType: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ areaSqft: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ isApproved: 1 });
listingSchema.index({ "location.city": 1 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
