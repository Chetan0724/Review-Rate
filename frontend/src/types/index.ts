export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  formatted: string;
  lat: number;
  lon: number;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  placeId?: string;
}

export interface Company {
  _id: string;
  companyName: string;
  address: Address;
  foundedOn: string;
  logo: string;
  avgRating: number;
  totalReviews: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  companyId: string;
  userId: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CompaniesResponse {
  companies: Company[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCompanies: number;
    limit: number;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: {
    totalReviews: number;
    avgRating: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    limit: number;
  };
}

export interface GeoapifyResult {
  properties: {
    formatted: string;
    lat: number;
    lon: number;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    place_id?: string;
  };
}
