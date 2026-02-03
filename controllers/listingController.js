import Listing from "../models/listingModel.js";

export const getAllListings = async (req, res) => {
  // 1. Basic pagination
  // NOTE : req.query.page OR limit will be strings, so convert to Number
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const finalLimit = Math.min(limit, 100);
  const skip = (page - 1) * finalLimit;

  // 2. get all the approved listings from DB
  const listings = await Listing.findByApprovedStatus(true)
    .sort({
      createdAt: "desc",
    })
    .skip(skip)
    .limit(finalLimit);

  const totalListings = await Listing.countDocuments({ isApproved: true });

  res.status(200).json({
    listings,
    totalListings,
    page,
    pages: Math.ceil(totalListings / finalLimit), // gives the number of pages
  });
};

export const getListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    "createdBy",
    "username avatar phone email",
  );

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (!listing.isApproved) {
    return res.status(403).json({ message: "Listing not approved" });
  }

  res.status(200).json(listing);
};

export const createListing = async (req, res) => {
  fields = [
    title,
    description,
    price,
    location,
    propertyType,
    status,
    bedrooms,
    bathrooms,
    areaSqft,
    images,
  ];

  if (fields.find((missingField) => !req.body[missingField])) {
    return res.status(400).json({
      message: `Please fill all required fields :: Missing field ${missingField}`,
    });
  }

  const newListing = new Listing({
    ...req.body, // better de-structuring way
    createdBy: req.user._id,
    isApproved: false,
  });

  const savedListing = await newListing.save();

  res.status(201).json(savedListing);
};

export const deleteListing = async (req, res) => {};

export const updateListing = async (req, res) => {};
