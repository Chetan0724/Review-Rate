import { useState, useEffect } from "react";
import { X, MapPin, Upload, Calendar } from "lucide-react";
import { companyApi } from "../api/company.api";
import { validateCompanyName, validateFoundedOn } from "../utils/validation";
import { toast } from "react-toastify";
import { type GeoapifyResult, type Address } from "../types";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export const AddCompanyModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddCompanyModalProps) => {
  const [companyName, setCompanyName] = useState("");
  const [foundedOn, setFoundedOn] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<GeoapifyResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Address | null>(
    null
  );
  const [errors, setErrors] = useState<{
    companyName?: string;
    foundedOn?: string;
    location?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!locationQuery) {
      setLocationResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            locationQuery
          )}&apiKey=${GEOAPIFY_API_KEY}`
        );
        const data = await response.json();
        setLocationResults(data.features || []);
      } catch (error) {
        console.error("Location search failed:", error);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [locationQuery]);

  if (!isOpen) return null;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (result: GeoapifyResult) => {
    const { formatted, lat, lon, city, state, country, postcode, place_id } =
      result.properties;
    setSelectedLocation({
      formatted,
      lat,
      lon,
      city,
      state,
      country,
      postcode,
      placeId: place_id,
    });
    setLocationQuery(formatted);
    setLocationResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const companyNameError = validateCompanyName(companyName);
    const foundedOnError = validateFoundedOn(foundedOn);
    const locationError = !selectedLocation ? "Location is required" : null;

    if (companyNameError || foundedOnError || locationError) {
      setErrors({
        companyName: companyNameError || undefined,
        foundedOn: foundedOnError || undefined,
        location: locationError || undefined,
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await companyApi.createCompany({
        companyName,
        address: selectedLocation!,
        foundedOn,
        logo: logo || undefined,
      });
      toast.success("Company added successfully!");
      onSuccess();
      onClose();
      setCompanyName("");
      setFoundedOn("");
      setLogo(null);
      setLogoPreview("");
      setLocationQuery("");
      setSelectedLocation(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add company";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Add Company</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Select Location"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <MapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />

              {locationResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {locationResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(result)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      {result.properties.formatted}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founded on
            </label>
            <div className="relative">
              <input
                type="date"
                value={foundedOn}
                onChange={(e) => setFoundedOn(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {errors.foundedOn && (
              <p className="text-red-500 text-sm mt-1">{errors.foundedOn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload size={20} />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>
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
