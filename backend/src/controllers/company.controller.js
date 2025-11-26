import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Company } from "../models/company.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCompany = asyncHandler(async (req, res) => {
  const { companyName, address, foundedOn } = req.body;

  if (!companyName || !address || !foundedOn) {
    throw new ApiError(400, "All required fields must be provided");
  }

  let addressData;
  try {
    addressData = typeof address === "string" ? JSON.parse(address) : address;
  } catch (error) {
    throw new ApiError(400, "Invalid address format");
  }

  if (!addressData.formatted || !addressData.lat || !addressData.lon) {
    throw new ApiError(400, "Address must contain formatted, lat, and lon");
  }

  let logoLocalPath;
  if (req.files && Array.isArray(req.files.logo) && req.files.logo.length > 0) {
    logoLocalPath = req.files.logo[0].path;
  }

  let logo;
  if (logoLocalPath) {
    logo = await uploadOnCloudinary(logoLocalPath);
  }

  const company = await Company.create({
    companyName,
    address: addressData,
    foundedOn,
    logo: logo?.url || "",
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, company, "Company created successfully"));
});

const getAllCompanies = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    city = "",
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  let query = {};

  if (search) {
    query.companyName = { $regex: search, $options: "i" };
  }

  if (city) {
    query["address.city"] = { $regex: city, $options: "i" };
  }

  const sortOptions = {};
  sortOptions[sortBy] = order === "asc" ? 1 : -1;

  const companies = await Company.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const totalCompanies = await Company.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        companies,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCompanies / limitNum),
          totalCompanies,
          limit: limitNum,
        },
      },
      "Companies fetched successfully"
    )
  );
});

const getCompanyById = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId).lean();

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company fetched successfully"));
});

export { createCompany, getAllCompanies, getCompanyById };
