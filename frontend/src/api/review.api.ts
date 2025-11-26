import { apiClient } from "./client";
import type { Review, ReviewsResponse } from "../types";

interface CreateReviewData {
  companyId: string;
  reviewText: string;
  rating: number;
}

interface GetReviewsParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "rating";
  order?: "asc" | "desc";
}

export const reviewApi = {
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    const response = await apiClient.post<{ data: Review }>(
      "/reviews/create",
      reviewData
    );
    return response.data;
  },

  async getReviewsByCompany(
    companyId: string,
    params: GetReviewsParams = {}
  ): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);

    const response = await apiClient.get<{ data: ReviewsResponse }>(
      `/reviews/company/${companyId}?${queryParams.toString()}`
    );
    return response.data;
  },
};
