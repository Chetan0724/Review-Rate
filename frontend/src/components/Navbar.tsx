import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LoginModal } from "./LoginModal";
import { SignupModal } from "./SignupModal";
import logo from "../assets/logo.svg";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar = ({ onSearch }: NavbarProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="logo" className="w-5 sm:w-7" />
              <div className="sm:text-2xl">
                <span className="font-light">Review</span>
                <span className="text-gradient-purple font-light">&</span>
                <span className="font-semibold">RATE</span>
              </div>
            </Link>

            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-xl mx-8 hidden sm:inline-block"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <Search
                  className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2">
                    <Search
                      className="text-gray-400 sm:hidden"
                      size={20}
                      onClick={() => setShowSearchBar((prev) => !prev)}
                    />
                    {user?.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {user?.fullName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium gradient-purple text-white rounded-md hover:opacity-90 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Search
                    className="text-gray-400 sm:hidden"
                    size={20}
                    onClick={() => setShowSearchBar((prev) => !prev)}
                  />

                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="sm:px-4 text-sm cursor-pointer"
                  >
                    SignUp
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="sm:px-4 text-sm cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
          {showSearchBar && (
            <form onSubmit={handleSearch} className="sm:hidden mb-3">
              <div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 "
                />
              </div>
            </form>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};
