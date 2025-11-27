import { User } from "lucide-react";
import { type Review } from "../types";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
          {review.userId.avatar ? (
            <img
              src={review.userId.avatar}
              alt={review.userId.fullName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User size={24} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-lg">{review.userId.fullName}</h4>
            <StarRating rating={review.rating} size={20} />
          </div>

          <div className="text-sm text-gray-600 mb-3">
            {formatDate(review.createdAt)}, {formatTime(review.createdAt)}
          </div>

          <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
        </div>
      </div>
    </div>
  );
};
