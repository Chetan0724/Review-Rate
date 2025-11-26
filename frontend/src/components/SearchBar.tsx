import { useState } from "react";
import { MapPin } from "lucide-react";

interface SearchBarProps {
  onCitySearch: (city: string) => void;
  onSortChange: (sortBy: string) => void;
  onAddCompany: () => void;
}

export const SearchBar = ({
  onCitySearch,
  onSortChange,
  onAddCompany,
}: SearchBarProps) => {
  const [city, setCity] = useState("");

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    onCitySearch(city);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select City
            </label>
            <form onSubmit={handleCitySearch} className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Indore, Madhya Pradesh, India"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <MapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </form>
          </div>

          <div className="flex items-end gap-4">
            <button
              type="button"
              onClick={handleCitySearch}
              className="px-6 py-2 gradient-purple text-white rounded-lg font-medium hover:opacity-90"
            >
              Find Company
            </button>

            <button
              type="button"
              onClick={onAddCompany}
              className="px-6 py-2 gradient-purple text-white rounded-lg font-medium hover:opacity-90"
            >
              + Add Company
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort:
              </label>
              <select
                onChange={(e) => onSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="companyName">Name</option>
                <option value="avgRating">Rating</option>
                <option value="address.city">Location</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
