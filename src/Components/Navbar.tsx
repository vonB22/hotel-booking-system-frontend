import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationContext } from '../contexts/NavigationContext';
import { Menu, X, User, LogOut, ChevronDown, Hotel, LayoutDashboard, Calendar, Settings, Sparkles } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Enhanced scroll effect with section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);

      // Track active section for navigation highlighting
      const sections = ['hero', 'hotels', 'about', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
      if (!target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  // ============================
  // DASHBOARD NAVBAR
  // ============================
  if (isDashboard) {
    return (
      <>
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .animate-slide-down {
            animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease;
          }
          .nav-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200% 100%;
          }
          .nav-shimmer:hover {
            animation: shimmer 2s infinite;
          }
        `}</style>

        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-16 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200' 
            : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
        }`}>
          <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
            
            {/* Left: Logo + Mobile sidebar toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMenu}
                className="p-2.5 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 rounded-xl lg:hidden transition-all hover:scale-105 active:scale-95 group"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
              </button>

              {/* Brand */}
              <div
                className="cursor-pointer flex items-center gap-2.5 group"
                onClick={() => navigate('/dashboard')}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                    <Hotel className="w-5 h-5" />
                  </div>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent hidden md:block group-hover:scale-105 transition-transform">
                  StayEase
                </h1>
              </div>
            </div>

            {/* Right: Avatar + Name + Dropdown */}
            <div className="relative user-dropdown-container">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 rounded-xl transition-all group"
                aria-label="User menu"
              >
                {/* Avatar with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-purple-100 transition-all group-hover:scale-110 group-hover:ring-4">
                    AD
                  </div>
                </div>

                {/* Name */}
                <span className="hidden sm:block font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                  Admin User
                </span>

                <ChevronDown className={`w-4 h-4 text-gray-600 transition-all duration-300 ${isUserDropdownOpen ? 'rotate-180 text-purple-600' : ''}`} />
              </button>

              {/* Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 animate-slide-down overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Admin User
                    </p>
                    <p className="text-xs text-gray-600 mt-1">admin@example.com</p>
                  </div>

                  <div className="p-2">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 text-sm text-gray-700 flex items-center gap-3 transition-all group rounded-xl"
                      onClick={() => {
                        navigate('/profile');
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium group-hover:translate-x-1 transition-transform">Profile</span>
                    </button>

                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 text-sm text-red-600 flex items-center gap-3 transition-all group rounded-xl mt-1"
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      <div className="p-2 bg-red-100 rounded-lg group-hover:scale-110 transition-transform">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-medium group-hover:translate-x-1 transition-transform">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Logout Modal */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slide-down overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Confirm Logout
                </h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-gray-700 leading-relaxed">Are you sure you want to logout? You'll need to login again to access your account.</p>
              </div>
              <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end bg-gray-50">
                <button
                  onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)}
                  disabled={isLoggingOut}
                  className="px-6 py-2.5 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  disabled={isLoggingOut}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-700 hover:to-pink-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {isLoggingOut ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Logging out...
                    </span>
                  ) : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ============================
  // LANDING NAVBAR
  // ============================

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Hotels', id: 'hotels' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-slide-down {
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        .nav-link {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link::before {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 100%;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover::before,
        .nav-link.active::before {
          transform: translateX(-50%) scaleX(1);
        }
        .nav-link.active {
          color: #667eea;
        }
        .nav-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
        }
        .nav-shimmer:hover {
          animation: shimmer 2s infinite;
        }
        .mobile-menu-slide {
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-16 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200' 
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
      }`}>
        <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        
          {/* Logo */}
          <div
            className="cursor-pointer group flex items-center gap-3"
            onClick={() => navigate('/landing')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg transition-all group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                <Hotel className="w-5 h-5" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent hidden md:block group-hover:scale-105 transition-transform">
              StayEase
            </h1>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`nav-link px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors font-semibold rounded-lg ${
                  activeSection === item.id ? 'active' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* User Dropdown */}
            <div className="relative hidden sm:block user-dropdown-container">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 rounded-xl transition-all group"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg ring-2 ring-purple-100 transition-all group-hover:scale-110 group-hover:ring-4">
                    U
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-all duration-300 ${isUserDropdownOpen ? 'rotate-180 text-purple-600' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 animate-slide-down overflow-hidden">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/user-dashboard');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 text-sm text-gray-700 flex items-center gap-3 transition-all group rounded-xl"
                    >
                      <div className="p-2 bg-indigo-100 rounded-lg group-hover:scale-110 transition-transform">
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="font-medium group-hover:translate-x-1 transition-transform">Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/my-bookings');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 text-sm text-gray-700 flex items-center gap-3 transition-all group rounded-xl"
                    >
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium group-hover:translate-x-1 transition-transform">My Bookings</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/user-settings');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 text-sm text-gray-700 flex items-center gap-3 transition-all group rounded-xl border-t border-gray-100 mt-1 pt-3"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Settings className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium group-hover:translate-x-1 transition-transform">Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 text-sm text-red-600 flex items-center gap-3 transition-all group rounded-xl mt-1"
                    >
                      <div className="p-2 bg-red-100 rounded-lg group-hover:scale-110 transition-transform">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-medium group-hover:translate-x-1 transition-transform">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2.5 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 rounded-xl transition-all hover:scale-105 active:scale-95 mobile-menu-container"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl mobile-menu-slide mobile-menu-container">
            <div className="flex flex-col p-4 gap-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 rounded-xl text-gray-700 font-semibold text-left transition-all hover:translate-x-1 ${
                    activeSection === item.id ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                <button
                  onClick={() => {
                    navigate('/user-dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-gray-700 font-semibold bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl text-left flex items-center gap-3 transition-all"
                >
                  <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/my-bookings');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-gray-700 font-semibold bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl text-left flex items-center gap-3 transition-all"
                >
                  <Calendar className="w-5 h-5 text-purple-600" />
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    navigate('/user-settings');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-gray-700 font-semibold bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl text-left flex items-center gap-3 transition-all"
                >
                  <Settings className="w-5 h-5 text-blue-600" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsLogoutModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-white font-semibold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl text-center transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slide-down overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Confirm Logout
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="text-gray-700 leading-relaxed">Are you sure you want to logout?</p>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="px-6 py-2.5 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-700 hover:to-pink-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isLoggingOut ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Logging out...
                  </span>
                ) : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
