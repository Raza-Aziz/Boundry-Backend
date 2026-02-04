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
      message: `Please fill all required fields`,
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

export const deleteListing = async (req, res) => {
  // find and delete the listing
  // req.listing by middleware
  const listing = req.listing;

  await listing.deleteOne();

  if (listingDeleted) {
    res.status(200).json({ message: "Listing successfully deleted" });
  } else {
    res.status(400).json({ message: "Deleting listing failed" });
  }
};

export const updateListing = async (req, res) => {
  // check if owner (done by middleware)
  // extract the details to be updated
  fields = [
    title,
    description,
    price,
    location,
    propertyType,
    bedrooms,
    bathrooms,
    areaSqft,
    images,
  ];

  if (fields.find((missingField) => !req.body[missingField])) {
    return res.status(400).json({
      message: `Please fill all required fields`,
    });
  }

  // HACK : No need for that, can do req.listing bcz of middleware instead
  // const listing = await Listing.findById(req.params.id);

  if (req.listing) {
    // replace existing with new data
    req.listing.title = req.body.title || listing.title;
    req.listing.description = req.body.description || listing.description;
    req.listing.price = req.body.price || listing.price;
    req.listing.location = req.body.location || listing.location;
    req.listing.propertyType = req.body.propertyType || listing.propertyType;
    req.listing.bedrooms = req.body.bedrooms || listing.bedrooms;
    req.listing.bathrooms = req.body.bathrooms || listing.bathrooms;
    req.listing.areaSqft = req.body.areaSqft || listing.areaSqft;
    // TODO: Check for images
    req.listing.images = req.body.images || listing.images;

    // the listing will go back for approval
    req.listing.isApproved = false;

    // re-save the document
    const updatedListing = await listing.save();

    // send data to frontend
    res.status(200).json(updatedListing);
  } else {
    return res.status(404).json({ message: "Listing not found" });
  }
};
