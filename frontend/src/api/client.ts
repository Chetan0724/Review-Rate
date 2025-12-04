const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

interface RequestOptions extends RequestInit {
  body?: any;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    try {
      const response = await fetch(`${this.baseURL}/users/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return newAccessToken;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { body, headers, ...restOptions } = options;

    const token = localStorage.getItem("accessToken");

    const config: RequestInit = {
      credentials: "include",
      ...restOptions,
      headers: {
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    if (body && !(body instanceof FormData)) {
      config.body = JSON.stringify(body);
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    } else if (body instanceof FormData) {
      config.body = body;
    }

    let response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (response.status === 401 && !endpoint.includes("/users/refresh-token")) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(`${this.baseURL}${endpoint}`, config);
        } catch (error) {
          this.isRefreshing = false;
          throw error;
        }
      } else {
        return new Promise((resolve, reject) => {
          this.subscribeTokenRefresh(async (token: string) => {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            };
            try {
              const retryResponse = await fetch(
                `${this.baseURL}${endpoint}`,
                config
              );
              const retryData = await retryResponse.json();
              if (!retryResponse.ok) {
                reject(new Error(retryData.message || "Something went wrong"));
              } else {
                resolve(retryData);
              }
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
