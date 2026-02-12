import Listing from "../models/listingModel.js";
import buildQuery from "../utils/buildQuery.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAllPublicListings = async (req, res) => {
  // 1. Basic pagination
  // NOTE : req.query.page OR limit will be strings, so convert to Number
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const finalLimit = Math.min(limit, 100);
  const skip = (page - 1) * finalLimit;

  const filters = buildQuery(req.query);

  const [listings, totalMatches] = await Promise.all([
    Listing.find(filters)
      .sort({
        createdAt: "desc",
      })
      .skip(skip)
      .limit(finalLimit),
    Listing.countDocuments(filters),
  ]);

  res.status(200).json({
    listings,
    totalMatches,
    page,
    pages: Math.ceil(totalMatches / finalLimit), // gives the number of pages
  });
};

// TODO: Merge pending and approved into one getUserListings method
export const getUserListings = async (req, res) => {
  try {
    // Explicit comparison : checking with 'false' (String) and not Boolean false
    // true if NOT false, false if === false, true if empty strings
    const isApproved = req.query.isApproved !== "false";

    const userListings = await Listing.find({
      createdBy: req.user._id,
      isApproved: isApproved,
    }).sort({ createdAt: "desc" });

    if (userListings.length === 0) {
      return res.status(404).json({
        message: `No ${isApproved ? "approved" : "pending"} listings.`,
        listings: [],
      });
    }

    res.status(200).json(userListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  try {
    const fields = [
      "title",
      "description",
      "price",
      "location",
      "propertyType",
      "status",
      "bedrooms",
      "bathrooms",
      "areaSqft",
    ];

    if (fields.find((missingField) => !req.body[missingField])) {
      return res.status(400).json({
        message: `Please fill all required fields`,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image." });
    }

    const uploadPromises = req.files.map((file) =>
      uploadOnCloudinary(file.path),
    );
    const uploadResults = await Promise.all(uploadPromises);

    const imagesData = uploadResults
      .filter((result) => result !== null)
      .map((result) => ({ url: result.url, publicId: result.publicId }));

    if (imageUrls.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to upload images to Cloudinary" });
    }

    const newListing = new Listing({
      ...req.body, // better de-structuring way
      images: imagesData, // Inject the Cloudinary URLs and Public IDs
      createdBy: req.user._id,
      isApproved: false,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    // find and delete the listing
    // req.listing by middleware
    const listing = req.listing;

    await listing.deleteOne();

    res.status(200).json({ message: "Listing successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: `Deleting listing failed :: ${error}` });
  }
};

export const updateListing = async (req, res) => {
  // check if owner (done by middleware)
  // extract the details to be updated
  const fields = [
    "title",
    "description",
    "price",
    "location",
    "propertyType",
    "bedrooms",
    "bathrooms",
    "areaSqft",
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
    req.listing.title = req.body.title || req.listing.title;
    req.listing.description = req.body.description || req.listing.description;
    req.listing.price = req.body.price || req.listing.price;
    req.listing.location = req.body.location || req.listing.location;
    req.listing.propertyType =
      req.body.propertyType || req.listing.propertyType;
    req.listing.bedrooms = req.body.bedrooms || req.listing.bedrooms;
    req.listing.bathrooms = req.body.bathrooms || req.listing.bathrooms;
    req.listing.areaSqft = req.body.areaSqft || req.listing.areaSqft;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path),
      );
      const uploadResults = await Promise.all(uploadPromises);

      const newImageData = uploadResults
        .filter((res) => res !== null)
        .map((result) => ({ url: result.url, publicId: result.publicId }));

      // Appending with old images
      req.listing.images.push(...newImageData);
    }

    // the listing will go back for approval
    req.listing.isApproved = false;

    // re-save the document
    const updatedListing = await req.listing.save();

    // send data to frontend
    res.status(200).json(updatedListing);
  } else {
    return res.status(404).json({ message: "Listing not found" });
  }
};
