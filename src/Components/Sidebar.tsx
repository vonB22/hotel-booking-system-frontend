import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationContext } from '../contexts/NavigationContext';
import Image from '../assets/img/admin.jpg';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  Users,
  Shield,
  BookOpen,
  LogOut
} from 'lucide-react';
import authService from '../services/auth';

 export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentItemId } = useContext(NavigationContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  const menuSections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' }
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'hotels', label: 'Hotels', icon: Building2, route: '/hotels' },
        { id: 'bookings', label: 'Bookings', icon: Calendar, route: '/bookings' },
        { id: 'users', label: 'Users', icon: Users, route: '/users' },
        { id: 'roles', label: 'Roles', icon: Shield, route: '/roles' }
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'user-bookings', label: 'My Bookings', icon: BookOpen, route: '/bookings' }
      ]
    }
  ];

  const isActive = (itemRoute: string) => {
    return location.pathname === itemRoute || location.pathname.startsWith(itemRoute + '/');
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (collapsed) {
      root.classList.add('sidebar-hidden');
      root.classList.remove('sidebar-visible');
    } else {
      root.classList.remove('sidebar-hidden');
      root.classList.add('sidebar-visible');
    }
    return () => {
      // cleanup - leave nothing sticky when component unmounts
      root.classList.remove('sidebar-hidden', 'sidebar-visible');
    };
  }, [collapsed]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length) setCurrentItemId?.(pathParts[0]);
  }, [location.pathname, isMobile, setCurrentItemId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !collapsed && isMobile) {
        setCollapsed(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [collapsed, isMobile]);

  const handleNavigate = (route: string) => {
    navigate(route);
    // For mobile, collapse after navigate to show content
    if (isMobile) setCollapsed(true);
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-300 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
        aria-expanded="false"
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className="sr-only">Toggle Sidebar</span>
        <LayoutDashboard className="w-6 h-6 text-indigo-600" />
      </button>

      {!collapsed && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity"
          aria-hidden="true"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        role="navigation"
        aria-label="Sidebar navigation"
        className={`fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 overflow-y-auto overflow-x-hidden z-50 custom-scrollbar transition-transform duration-300
          ${collapsed ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0`}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <img
              src={Image}
              alt="Admin avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm bg-gray-100"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">StayEase</p>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          <nav aria-label="Primary" className="space-y-6">
            {menuSections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.route);
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavigate(item.route)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500
                            ${active
                              ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                              : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'}`}
                          aria-current={active ? 'page' : undefined}
                          aria-label={item.label}
                        >
                          {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                          <span className="relative" aria-hidden>
                            <Icon
                              className={`w-5 h-5 shrink-0 transition-transform duration-200
                                ${active ? 'scale-110' : 'group-hover:scale-110'}`}
                            />
                          </span>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent border-t border-gray-200">
          <div className="space-y-2">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Profile"
              onClick={() => {
                navigate('/profile');
                if (isMobile) setCollapsed(true);
              }}
            >
              <img
                src={Image}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover border border-gray-300 mr-2"
              />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 animate-fade-in">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Confirm Logout</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">Are you sure you want to logout?</p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await authService.logout();
                  setIsLogoutModalOpen(false);
                  navigate('/login');
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        main {
          margin-left: 18rem;
        }
        @media (max-width: 1023px) {
          main { margin-left: 0 !important; }
        }
        @media (min-width: 1024px) {
          :root.sidebar-hidden main { margin-left: 0 !important; }
        }
      `}</style>
    </>
  );
}
