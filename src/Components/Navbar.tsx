import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationContext } from '../contexts/NavigationContext';
import { Menu, X, User, LogOut, ChevronDown, Hotel } from 'lucide-react';
import authService from '../services/auth';

interface NavbarProps {
  isDashboard?: boolean;
}

export default function Navbar({ isDashboard = false }: NavbarProps) {
  useContext(NavigationContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // ============================
  // DASHBOARD NAVBAR
  // ============================
  if (isDashboard) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 h-16">
        <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          
          {/* Left: Logo + Mobile sidebar toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand */}
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() => navigate('/dashboard')}
            >
              <h1 className="text-xl font-bold text-gray-900 hidden md:block">
                StayEase
              </h1>
            </div>
          </div>

          {/* Right: Avatar + Name + Dropdown */}
          <div className="relative">
            <button
              onClick={toggleUserDropdown}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                AD
              </div>

              {/* Name */}
              <span className="hidden sm:block font-medium text-gray-900">
                Admin User
              </span>

              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dropdown */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-md border border-gray-200 animate-slide-down overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600 flex items-center gap-2 border-t border-gray-100"
                  onClick={() => setIsLogoutModalOpen(true)}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

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
      </nav>
    );
  }

  // ============================
  // LANDING NAVBAR
  // ============================

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 h-16">
      <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
      
        {/* Logo */}
        <div
          className="cursor-pointer group flex items-center gap-3"
          onClick={() => navigate('/landing')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110">
            <Hotel className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 hidden md:block group-hover:scale-105 transition">
            StayEase
          </h1>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Hotels', 'About', 'Contact'].map((item) => (
            <button
              key={item}
              className="text-gray-700 hover:text-purple-600 transition font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-indigo-500 hover:after:w-full after:transition-all"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Logout button / Mobile menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition hidden sm:block"
          >
            Logout
          </button>

          {/* Mobile menu */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow animate-slide-down">
          <div className="flex flex-col p-4 gap-2">
            {['Home', 'Hotels', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                className="px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-left"
              >
                {item}
              </button>
            ))}

            <div className="border-t border-gray-200 pt-2 mt-2">
              <button
                onClick={() => {
                  setIsLogoutModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-700 rounded-lg text-center"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

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
    </nav>
  );
}
