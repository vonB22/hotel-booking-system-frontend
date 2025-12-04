import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/global.css';
import './assets/skeleton-styles.css';

// Services
import authService from './services/auth';
import type { AuthState } from './services/auth';

// Contexts
export { AuthContext } from './contexts/AuthContext';
export { NavigationContext } from './contexts/NavigationContext';
import { AuthContext } from './contexts/AuthContext';
import { NavigationContext } from './contexts/NavigationContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import LandingLayout from './layouts/LandingLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Landing Pages
import Home from './pages/landing/Home';
import Dashboard from './pages/landing/Dashboard';
import Settings from './pages/landing/Settings';
import MyBookings from './pages/landing/MyBookings';

// Dashboard Pages
import OverviewHome from './pages/dashboard/overview/Home';
import BookingsIndex from './pages/dashboard/bookings/Index';
import BookingsCreate from './pages/dashboard/bookings/Create';
import BookingsEdit from './pages/dashboard/bookings/Edit';
import BookingsShow from './pages/dashboard/bookings/Show';
import HotelsIndex from './pages/dashboard/hotels/Index';
import HotelsCreate from './pages/dashboard/hotels/Create';
import HotelsEdit from './pages/dashboard/hotels/Edit';
import HotelsShow from './pages/dashboard/hotels/Show';
import RolesIndex from './pages/dashboard/roles/Index';
import RolesCreate from './pages/dashboard/roles/Create';
import RolesEdit from './pages/dashboard/roles/Edit';
import RolesShow from './pages/dashboard/roles/Show';
import UsersIndex from './pages/dashboard/users/Index';
import UsersCreate from './pages/dashboard/users/Create';
import UsersEdit from './pages/dashboard/users/Edit';
import UsersShow from './pages/dashboard/users/Show';
import SettingsIndex from './pages/dashboard/Settings/index';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const authState = React.useContext(AuthContext);

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !authState.hasRole(requiredRole)) {
    // If authenticated but lacks role, redirect to landing page to prevent access to admin dashboard
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
};

// Legacy Navigation Provider Wrapper for old pages
const LegacyNavigationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentItemId, setCurrentItemId] = useState<string>('1');
  const navRef = React.useRef({ currentPage, setCurrentPage });

  useEffect(() => {
    navRef.current = { currentPage, setCurrentPage };
  }, [currentPage]);

  const navigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigate, currentItemId, setCurrentItemId }}>
      {children}
    </NavigationContext.Provider>
  );
};

function AppContent() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth on mount
  useEffect(() => {
    // First, trigger auth initialization (restoring session from token if exists)
    authService.getCurrentUser().catch(() => {
      // If getCurrentUser fails, auth will be logged out via authService's error handling
    });

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((newState) => {
      setAuthState(newState);
    });

    // Get initial state
    setAuthState(authService.getState());

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login: authService.login.bind(authService),
        register: authService.register.bind(authService),
        logout: authService.logout.bind(authService),
        hasRole: authService.hasRole.bind(authService),
        hasPermission: authService.hasPermission.bind(authService),
      }}
    >
      <LegacyNavigationWrapper>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Landing Routes */}
          <Route path="/landing" element={<LandingLayout><Home /></LandingLayout>} />

          {/* User Dashboard Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <LandingLayout>
                  <Dashboard />
                </LandingLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-settings"
            element={
              <ProtectedRoute>
                <LandingLayout>
                  <Settings />
                </LandingLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <LandingLayout>
                  <MyBookings />
                </LandingLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings/:id"
            element={
              <ProtectedRoute>
                <LandingLayout>
                  <MyBookings />
                </LandingLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <OverviewHome />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Bookings Routes (Admin-only) */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <BookingsIndex />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/create"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <BookingsCreate />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <BookingsShow />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id/edit"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <BookingsEdit />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Hotels Routes (Admin-only) */}
          <Route
            path="/hotels"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <HotelsIndex />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/create"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <HotelsCreate />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:id"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <HotelsShow />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:id/edit"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <HotelsEdit />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Roles Routes - Admin Only */}
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <RolesIndex />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles/create"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <RolesCreate />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles/:id"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <RolesShow />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles/:id/edit"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <RolesEdit />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Users Routes - Admin Only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <UsersIndex />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <UsersShow />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <UsersCreate />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute requiredRole="Admin">
                <DashboardLayout>
                  <UsersEdit />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Settings Route - Accessible to all authenticated users */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsIndex />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LegacyNavigationWrapper>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
