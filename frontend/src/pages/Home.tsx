import { useState, useEffect } from "react";
import { companyApi } from "../api/company.api";
import { type Company } from "../types";
import { CompanyCard } from "../components/CompanyCard";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { AddCompanyModal } from "../components/AddCompanyModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface HomeProps {
  searchQuery: string;
}

export const Home = ({ searchQuery }: HomeProps) => {
  const { isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState<
    "companyName" | "avgRating" | "createdAt"
  >("createdAt");
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchQuery, city, sortBy]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await companyApi.getAllCompanies({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        city: city,
        sortBy: sortBy,
        order: "desc",
      });
      setCompanies(response.companies);
      setTotalPages(response.pagination.totalPages);
      setTotalCompanies(response.pagination.totalCompanies);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch companies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySearch = (searchCity: string) => {
    setCity(searchCity);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as "companyName" | "avgRating" | "createdAt");
    setCurrentPage(1);
  };

  const handleAddCompany = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add a company");
      return;
    }
    setShowAddCompanyModal(true);
  };

  const handleCompanyAdded = () => {
    fetchCompanies();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        onCitySearch={handleCitySearch}
        onSortChange={handleSortChange}
        onAddCompany={handleAddCompany}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-3">
          <h2 className="text-xs text-neutral-500">
            Result Found: {totalCompanies}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No companies found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddCompanyModal
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
        onSuccess={handleCompanyAdded}
      />
    </div>
  );
};
