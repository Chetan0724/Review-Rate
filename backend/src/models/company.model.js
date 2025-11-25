import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    address: {
      formatted: { type: String, required: true },
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postcode: { type: String },
      placeId: { type: String },
    },
    foundedOn: { type: String, required: true },
    logo: { type: String },
    description: { type: String },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
