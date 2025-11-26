import { apiClient } from "./client";
import { type AuthResponse, type User } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  avatar?: File;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/users/login",
      credentials
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data;
  },

  async signup(signupData: SignupData): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    if (signupData.avatar) {
      formData.append("avatar", signupData.avatar);
    }

    const response = await apiClient.post<{ data: AuthResponse }>(
      "/users/register",
      formData
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/users/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ data: User }>("/users/current-user");
    return response.data;
  },

  async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await apiClient.post<{
      data: { accessToken: string; refreshToken: string };
    }>("/users/refresh-token", { refreshToken });
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
  },
};
