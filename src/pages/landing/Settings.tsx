import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, CheckCircle, User, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import apiService from '../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface FormData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchUser();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        const userData = response.data as unknown as User;
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError('Failed to load user information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setErrors({});
    setSuccessMessage('');
    setIsSaving(true);

    try {
      // Validate form
      const newErrors: Record<string, string> = {};

      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = 'Invalid email format';
      }

      // Check password fields
      if (formData.newPassword && !formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }

      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSaving(false);
        return;
      }

      // Prepare update data
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        updateData.current_password = formData.currentPassword;
      }

      // Call API to update user
      const response = await apiService.updateUser(user.id, updateData);

      if (response.success) {
        setSuccessMessage('Settings updated successfully!');
        // Update local state
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
        });
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to update settings');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err?.message || 'An error occurred while updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .skeleton-loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="h-8 w-48 skeleton-loading rounded mb-4"></div>
              <div className="h-4 w-64 skeleton-loading rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .input-field {
          transition: all 0.3s ease;
        }

        .input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.1);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="space-y-6">
            {/* Header */}
            <div className={`flex items-center justify-between mb-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
              </div>
              <button
                onClick={() => navigate('/landing')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all font-medium border border-gray-200 hover:border-gray-300 active:scale-95"
                title="Back to website"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Website
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm animate-slide-up">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-100 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 shadow-sm animate-slide-up">
                <CheckCircle className="w-5 h-5" />
                {successMessage}
              </div>
            )}

            {/* Settings Form */}
            <div className={`glass-effect rounded-2xl shadow-xl overflow-hidden ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Account Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
                      <p className="text-sm text-gray-600">Update your personal details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all bg-white"
                        disabled={isSaving}
                        placeholder="Your full name"
                        title="Full name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all bg-white"
                        disabled={isSaving}
                        placeholder="your.email@example.com"
                        title="Email address"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Security</h3>
                      <p className="text-sm text-gray-600">Change your password (optional)</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Leave password fields blank if you don't want to change your password
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Lock className="w-4 h-4 text-purple-600" />
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all bg-white"
                        disabled={isSaving}
                        placeholder="Enter current password"
                        title="Current password"
                      />
                      {errors.currentPassword && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Lock className="w-4 h-4 text-purple-600" />
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all bg-white"
                          disabled={isSaving}
                          placeholder="Min 6 characters"
                          title="New password"
                        />
                        {errors.newPassword && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Lock className="w-4 h-4 text-purple-600" />
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all bg-white"
                          disabled={isSaving}
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/user-dashboard')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold active:scale-95"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
