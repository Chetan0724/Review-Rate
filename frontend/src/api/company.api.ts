import { apiClient } from "./client";
import type { Company, CompaniesResponse, Address } from "../types";

interface CreateCompanyData {
  companyName: string;
  address: Address;
  foundedOn: string;
  logo?: File;
}

interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  sortBy?: "companyName" | "avgRating" | "createdAt";
  order?: "asc" | "desc";
}

export const companyApi = {
  async createCompany(companyData: CreateCompanyData): Promise<Company> {
    const formData = new FormData();
    formData.append("companyName", companyData.companyName);
    formData.append("address", JSON.stringify(companyData.address));
    formData.append("foundedOn", companyData.foundedOn);
    if (companyData.logo) {
      formData.append("logo", companyData.logo);
    }

    const response = await apiClient.post<{ data: Company }>(
      "/companies/create",
      formData
    );
    return response.data;
  },

  async getAllCompanies(
    params: GetCompaniesParams = {}
  ): Promise<CompaniesResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.city) queryParams.append("city", params.city);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);

    const response = await apiClient.get<{ data: CompaniesResponse }>(
      `/companies?${queryParams.toString()}`
    );
    return response.data;
  },

  async getCompanyById(companyId: string): Promise<Company> {
    const response = await apiClient.get<{ data: Company }>(
      `/companies/${companyId}`
    );
    return response.data;
  },
};
