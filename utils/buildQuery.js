const buildQuery = (userRequests) => {
  let query = { isApproved: true };

  if ("city" in userRequests) {
    query["location.city"] = userRequests.city;
  }

  if ("minPrice" in userRequests || "maxPrice" in userRequests) {
    query.price = {};

    if (userRequests.minPrice) {
      query.price.$gte = Number(userRequests.minPrice);
    }
    if (userRequests.maxPrice) {
      query.price.$lte = Number(userRequests.maxPrice);
    }
  }

  if (userRequests.search) {
    // INFO : "i" meaning case-insensitive
    query.title = { $regex: userRequests.search, $options: "i" };
  }

  if ("bedrooms" in userRequests) {
    query.bedrooms = Number(userRequests.bedrooms);
  }

  if ("minAreaSqft" in userRequests || "maxAreaSqft" in userRequests) {
    query.areaSqft = {};

    if ("minAreaSqft" in userRequests) {
      query.areaSqft.$gte = userRequests.minAreaSqft;
    }
    if ("maxAreaSqft" in userRequests) {
      query.areaSqft.$lte = userRequests.maxAreaSqft;
    }
  }

  if ("propertyType" in userRequests) {
    const propertyTypesArray = userRequests.propertyType.split(",");

    query.propertyType = { $in: propertyTypesArray };
  }

  return query;
};

export default buildQuery;
