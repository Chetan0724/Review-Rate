import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type User } from "../types";
import { authApi } from "../api/auth.api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    fullName: string,
    email: string,
    password: string,
    avatar?: File
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (token && refreshToken) {
        try {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to get current user:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    avatar?: File
  ) => {
    const response = await authApi.signup({
      fullName,
      email,
      password,
      avatar,
    });
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
