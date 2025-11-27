import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { MapPin, Building2 } from "lucide-react";
import { companyApi } from "../api/company.api";
import { reviewApi } from "../api/review.api";
import { type Company, type Review } from "../types";
import { ReviewCard } from "../components/ReviewCard";
import { Pagination } from "../components/Pagination";
import { AddReviewModal } from "../components/AddReviewModal";
import { StarRating } from "../components/StarRating";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const CompanyReviews = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { isAuthenticated } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchReviews();
    }
  }, [companyId, currentPage]);

  const fetchCompany = async () => {
    try {
      const data = await companyApi.getCompanyById(companyId!);
      setCompany(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch company details");
    }
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await reviewApi.getReviewsByCompany(companyId!, {
        page: currentPage,
        limit: 5,
        sortBy: "createdAt",
        order: "desc",
      });
      setReviews(response.reviews);
      setTotalPages(response.pagination.totalPages);
      setTotalReviews(response.stats.totalReviews);
      setAvgRating(response.stats.avgRating);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReview = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add a review");
      return;
    }
    setShowAddReviewModal(true);
  };

  const handleReviewAdded = () => {
    fetchCompany();
    fetchReviews();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-lg flex items-center justify-center bg-gray-100 flex-shrink-0">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.companyName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building2 size={40} className="text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{company.companyName}</h1>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin size={18} />
                <span>{company.address.formatted}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {avgRating.toFixed(1)}
                  </span>
                  <StarRating rating={avgRating} size={24} />
                </div>
                <span className="text-gray-600">{totalReviews} Reviews</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-neutral-500 mb-4">
                Founded on {formatDate(company.foundedOn)}
              </div>
              <button
                onClick={handleAddReview}
                className="px-6 py-2 gradient-purple text-white rounded-md font-medium hover:opacity-90"
              >
                + Add Review
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs text-neutral-500">
            Result Found: {totalReviews}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddReviewModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        onSuccess={handleReviewAdded}
        companyId={companyId!}
      />
    </div>
  );
};
