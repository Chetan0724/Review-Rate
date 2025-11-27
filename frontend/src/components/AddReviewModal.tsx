import { useState } from "react";
import { X } from "lucide-react";
import { reviewApi } from "../api/review.api";
import { validateReviewText, validateRating } from "../utils/validation";
import { toast } from "react-toastify";
import { StarRating } from "./StarRating";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: string;
}

export const AddReviewModal = ({
  isOpen,
  onClose,
  onSuccess,
  companyId,
}: AddReviewModalProps) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<{
    reviewText?: string;
    rating?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewTextError = validateReviewText(reviewText);
    const ratingError = validateRating(rating);

    if (reviewTextError || ratingError) {
      setErrors({
        reviewText: reviewTextError || undefined,
        rating: ratingError || undefined,
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await reviewApi.createReview({
        companyId,
        reviewText,
        rating,
      });
      toast.success("Review added successfully!");
      onSuccess();
      onClose();
      setReviewText("");
      setRating(0);
    } catch (error: any) {
      toast.error(error.message || "Failed to add review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Add Review</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.reviewText && (
              <p className="text-red-500 text-sm mt-1">{errors.reviewText}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size={32}
                interactive
              />
              <span className="text-sm text-gray-600">
                {rating === 0
                  ? "Select rating"
                  : rating === 5
                  ? "Excellent"
                  : rating === 4
                  ? "Satisfied"
                  : rating === 3
                  ? "Average"
                  : rating === 2
                  ? "Poor"
                  : "Very Poor"}
              </span>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 gradient-purple text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
