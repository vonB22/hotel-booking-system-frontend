import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    fetchUser();
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/user-dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all"
                  disabled={isSaving}
                  placeholder="Your full name"
                  title="Full name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all"
                  disabled={isSaving}
                  placeholder="your.email@example.com"
                  title="Email address"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Change Password (Optional)</h3>
            <p className="text-gray-600 text-sm mb-4">Leave blank if you don't want to change your password</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all"
                  disabled={isSaving}
                  placeholder="Only required if changing password"
                  title="Current password"
                />
                {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all"
                  disabled={isSaving}
                  placeholder="Min 6 characters"
                  title="New password"
                />
                {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all"
                  disabled={isSaving}
                  placeholder="Confirm your new password"
                />
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/user-dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
        </div>
      </div>
      </div>
    </div>
  );
}
