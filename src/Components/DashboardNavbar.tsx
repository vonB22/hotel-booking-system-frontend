import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, Settings } from 'lucide-react';
import authService from '../services/auth';
import apiService from '../services/api';
import adminImage from '../assets/img/admin.jpg';

interface DashboardNavbarProps {
  userName?: string;
}

export default function DashboardNavbar({ userName: propUserName }: DashboardNavbarProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState(propUserName || 'Admin');

  // Fetch logged-in user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          const name = (response.data as any).name || propUserName || 'Admin';
          setUserName(name);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
    fetchUserData();
  }, [propUserName]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      navigate('/login');
    } catch (err) {
      setIsLoggingOut(false);
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 h-16">
        <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          
          {/* Left: Mobile sidebar toggle only */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Right: Avatar + Name + Dropdown */}
          <div className="relative user-dropdown-container">
            <button
              onClick={toggleUserDropdown}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition"
            >
              {/* Avatar */}
              <img
                src={adminImage}
                alt="Admin Avatar"
                className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-200"
              />

              {/* Name */}
              <span className="hidden sm:block font-medium text-gray-900 text-sm">
                {userName}
              </span>

              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dropdown */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 animate-slide-down overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                  onClick={() => {
                    navigate('/settings');
                    setIsUserDropdownOpen(false);
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600 flex items-center gap-2 border-t border-gray-100"
                  onClick={() => {
                    setIsLogoutModalOpen(true);
                    setIsUserDropdownOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 animate-fade-in">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Confirm Logout</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">Are you sure you want to logout? You'll need to login again to access your account.</p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
