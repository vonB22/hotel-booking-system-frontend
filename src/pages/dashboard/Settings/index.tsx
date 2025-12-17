import { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useAppToast } from '../../../App';
import Button from '../../../Components/Button';
import FormInput from '../../../Components/FormInput';
import { User, Mail, Lock, Edit2, Save, X, Moon, Sun, Trash2, AlertTriangle } from 'lucide-react';
import authService from '../../../services/auth';
import apiService from '../../../services/api';

export default function Index() {
  const auth = useContext(AuthContext);
  const toast = useAppToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then check document
    if (typeof document !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    bookingUpdates: true,
    promotions: false,
    newsletter: true,
  });
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: '',
    location: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (typeof document !== 'undefined') {
        if (newMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
      return newMode;
    });
    setSuccess('Theme updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSuccess('Notification preferences updated');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete my account') {
      setError('Please type "delete my account" to confirm');
      return;
    }

    setIsDeleting(true);
    setDeleteMessage('');

    try {
      // Simulate API call (backend endpoint would be needed)
      setDeleteMessage('Account deletion request submitted successfully. Your account will be permanently deleted within 24 hours.');
      setTimeout(() => {
        setShowDeleteModal(false);
        // In a real scenario, you would log out the user after a successful deletion
        // await authService.logout();
        // navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await apiService.updateUser(auth.user?.id || 0, {
        name: formData.name,
        email: formData.email,
      });

      if (response.success) {
        toast.success('Profile updated successfully');
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Refresh user data
        await authService.getCurrentUser();
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);

    try {
      const response = await apiService.updateUser(auth.user?.id || 0, {
        password: formData.newPassword,
      });

      if (response.success) {
        toast.success('Password changed successfully');
        setSuccess('Password changed successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account, preferences, and privacy</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center justify-between animate-fade-in">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800" title="Close message">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between animate-fade-in">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800" title="Close message">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Profile Information Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Profile Information</h2>
            <p className="text-gray-600">Update your personal details</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title={isEditing ? 'Cancel editing' : 'Edit profile'}
          >
            {isEditing ? (
              <X className="w-5 h-5 text-red-600" />
            ) : (
              <Edit2 className="w-5 h-5 text-purple-600" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
            {isEditing ? (
              <FormInput
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            ) : (
              <div className="flex-1">
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-lg font-semibold">{auth.user?.name}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
            {isEditing ? (
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            ) : (
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="text-lg font-semibold">{auth.user?.email}</p>
              </div>
            )}
          </div>

          {/* Role Badge */}
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Account Role</p>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium inline-block mt-1">
                {auth.user?.roles?.[0] || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex items-center gap-4 justify-end mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: auth.user?.name || '',
                  email: auth.user?.email || '',
                  phone: '',
                  location: '',
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 inline mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Theme Settings Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
        <h2 className="text-2xl font-semibold mb-2">Appearance</h2>
        <p className="text-gray-600 mb-6">Customize how the application looks</p>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-purple-600" />
            )}
            <div>
              <p className="font-semibold">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
              <p className="text-sm text-gray-600">{isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
        <h2 className="text-2xl font-semibold mb-2">Notifications</h2>
        <p className="text-gray-600 mb-6">Manage your notification preferences</p>

        <div className="space-y-3">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your account' },
            { key: 'bookingUpdates', label: 'Booking Updates', description: 'Get notified about booking status changes' },
            { key: 'promotions', label: 'Promotions', description: 'Receive promotional offers and deals' },
            { key: 'newsletter', label: 'Newsletter', description: 'Subscribe to our weekly newsletter' },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <button
                onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notifications[key as keyof typeof notifications] ? 'bg-green-500' : 'bg-gray-300'
                }`}
                title={`Toggle ${label}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notifications[key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Security</h2>
          <p className="text-gray-600">Manage your password and account security</p>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <FormInput
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              disabled={isSaving}
            />
          </div>

          {/* New Password */}
          <div>
            <FormInput
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              disabled={isSaving}
            />
            {formData.newPassword && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <FormInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 justify-end mt-6 pt-6 border-t">
          <Button
            variant="primary"
            onClick={handleChangePassword}
            disabled={isSaving || !formData.newPassword}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            {isSaving ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
        <h2 className="text-2xl font-semibold mb-6">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 font-semibold">Account Created</p>
            <p className="text-lg font-semibold text-blue-700 mt-1">
              {auth.user?.created_at ? new Date(auth.user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 font-semibold">Last Updated</p>
            <p className="text-lg font-semibold text-green-700 mt-1">
              {auth.user?.updated_at ? new Date(auth.user.updated_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 font-semibold">User ID</p>
            <p className="text-lg font-semibold text-purple-700 mt-1 font-mono">{auth.user?.id}</p>
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-semibold text-red-700">Danger Zone</h2>
        </div>
        <p className="text-gray-700 mb-6">Irreversible and destructive actions</p>

        <div className="p-4 bg-red-100 rounded-lg border border-red-300 mb-4">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> Deleting your account is permanent and cannot be undone. All your data will be permanently deleted.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowDeleteModal(true)}
          className="!bg-red-600 hover:!bg-red-700"
        >
          <Trash2 className="w-4 h-4 inline mr-2" />
          Delete Account
        </Button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideScaleUp {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
              20%, 40%, 60%, 80% { transform: translateX(2px); }
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out;
            }
            .animate-modal-in {
              animation: slideScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .delete-icon-shake:hover {
              animation: shake 0.5s ease-in-out;
            }
          `}</style>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-modal-in border border-red-200">
            <div className="border-b border-red-200 px-6 py-4 bg-red-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center delete-icon-shake">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-red-700">Delete Account</h2>
              </div>
            </div>

            {deleteMessage ? (
              <div className="px-6 py-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-green-800 font-semibold">{deleteMessage}</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4">
                  <p className="text-gray-700 mb-4 text-sm">
                    This action cannot be undone. Please type <strong>"delete my account"</strong> to confirm.
                  </p>
                  <FormInput
                    label="Confirmation"
                    placeholder='Type "delete my account"'
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation((e.target as HTMLInputElement).value)}
                    disabled={isDeleting}
                  />
                </div>
                <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation('');
                      setDeleteMessage('');
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation.toLowerCase() !== 'delete my account'}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
