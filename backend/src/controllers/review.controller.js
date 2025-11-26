import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Review } from "../models/review.model.js";
import { Company } from "../models/company.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReview = asyncHandler(async (req, res) => {
  const { companyId, reviewText, rating } = req.body;

  if (!companyId || !reviewText || !rating) {
    throw new ApiError(400, "All fields are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const company = await Company.findById(companyId);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const existingReview = await Review.findOne({
    companyId,
    userId: req.user._id,
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this company");
  }

  const review = await Review.create({
    companyId,
    userId: req.user._id,
    reviewText,
    rating,
  });

  const allReviews = await Review.find({ companyId });
  const totalReviews = allReviews.length;
  const avgRating =
    allReviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews;

  await Company.findByIdAndUpdate(companyId, {
    avgRating: parseFloat(avgRating.toFixed(2)),
    totalReviews,
  });

  const populatedReview = await Review.findById(review._id)
    .populate("userId", "fullName avatar")
    .lean();

  return res
    .status(201)
    .json(new ApiResponse(201, populatedReview, "Review created successfully"));
});

const getReviewsByCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const {
    page = 1,
    limit = 5,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const company = await Company.findById(companyId);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const sortOptions = {};
  sortOptions[sortBy] = order === "asc" ? 1 : -1;

  const reviews = await Review.find({ companyId })
    .populate("userId", "fullName avatar")
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const totalReviews = await Review.countDocuments({ companyId });

  const allReviews = await Review.find({ companyId });
  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length
      : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        stats: {
          totalReviews,
          avgRating: parseFloat(avgRating.toFixed(2)),
        },
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalReviews / limitNum),
          totalReviews,
          limit: limitNum,
        },
      },
      "Reviews fetched successfully"
    )
  );
});

export { createReview, getReviewsByCompany };
