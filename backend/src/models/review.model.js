import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

reviewSchema.index({ companyId: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

export const Review = mongoose.model("Review", reviewSchema);
