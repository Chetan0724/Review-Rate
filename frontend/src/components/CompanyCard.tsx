import { useNavigate } from "react-router";
import { MapPin, Building2 } from "lucide-react";
import { type Company } from "../types";
import { StarRating } from "./StarRating";

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-gray-100 flex-shrink-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.companyName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Building2 size={32} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{company.companyName}</h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin size={16} />
            <span>{company.address.formatted}</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold">
                {company.avgRating.toFixed(1)}
              </span>
              <StarRating rating={company.avgRating} size={20} />
            </div>
            <span className="text-sm text-gray-600">
              {company.totalReviews} Reviews
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-sm text-gray-600 mb-3">
            {company.foundedOn.includes("-")
              ? `Founded on ${formatDate(company.foundedOn)}`
              : `Reg. Date ${formatDate(company.createdAt)}`}
          </div>
          <button
            onClick={() => navigate(`/company/${company._id}`)}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Detail Review
          </button>
        </div>
      </div>
    </div>
  );
};
