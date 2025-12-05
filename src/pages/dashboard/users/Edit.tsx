import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import apiService from '../../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  roles?: string[];
  status?: string;
  password?: string;
}

export default function Edit() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
  });
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Password validation
  const passwordStrength = {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
    minLength: password.length >= 8
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const passwordsMatch = password === passwordConfirm;
  const isPasswordValid = password.length === 0 || (password.length >= 8 && strengthScore >= 3 && passwordsMatch);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getUser(id);
      console.log('User fetch response:', response);
      if (response.success && response.data) {
        const userData = response.data as any;
        console.log('User data:', userData);
        const roleValue = userData.role || (userData.roles && userData.roles.length > 0 ? userData.roles[0] : 'User');
        const statusValue = userData.status || 'Active';
        console.log('Extracted role:', roleValue, 'status:', statusValue);
        setFormData({
          id: userData.id || 0,
          name: userData.name || '',
          email: userData.email || '',
          role: roleValue,
          status: statusValue,
          password: userData.password || '',
        });
      } else {
        setError(response.message || 'Failed to fetch user');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setErrors({});
    setIsSubmitting(true);

    try {
      const submitData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };

      // Only include password if it's provided and matches
      if (password) {
        if (password !== passwordConfirm) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        submitData.password = password;
        submitData.password_confirmation = passwordConfirm;
      }

      console.log('Submitting user data:', submitData);
      
      const response = await apiService.updateUser(id, submitData);

      console.log('Update response:', response);
      
      if (response.success) {
        navigate('/users');
      } else {
        setError(response.message || 'Failed to update user');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setError(err.message || 'An error occurred while updating user');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/users')} className="p-2 hover:bg-gray-100 rounded-lg" title="Back to users" aria-label="Back to users">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">Edit User #{id}</h1>
          <p className="text-gray-600">Update user information</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-600">Loading user details...</p>
        </div>
      )}

      {!isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <FormInput label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={isSubmitting} />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>}
            </div>
            <div>
              <FormInput label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={isSubmitting} />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={formData.role || 'User'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={isSubmitting}
                title="Select user role"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={isSubmitting}
                title="Select user status"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status[0]}</p>}
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Change Password (Optional)</h3>
              
              {/* New Password */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-50 ${
                      password.length > 0 && password.length < 8
                        ? 'border-red-300 focus:ring-red-500'
                        : password.length > 0 && strengthScore >= 3
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            strengthScore <= 2 ? 'w-1/3 bg-red-500' :
                            strengthScore <= 3 ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        ></div>
                      </div>
                      <span className={`text-xs font-semibold ${
                        strengthScore <= 2 ? 'text-red-600' :
                        strengthScore <= 3 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {strengthScore <= 2 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.minLength ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.minLength ? '✓' : '✗'}
                        </span>
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.hasUppercase ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.hasUppercase ? '✓' : '✗'}
                        </span>
                        Uppercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.hasLowercase ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.hasLowercase ? '✓' : '✗'}
                        </span>
                        Lowercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.hasNumber ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.hasNumber ? '✓' : '✗'}
                        </span>
                        Number
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.hasSpecial ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.hasSpecial ? '✓' : '✗'}
                        </span>
                        Special character (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}

                {password.length > 0 && password.length < 8 && (
                  <p className="text-red-600 text-sm mt-2 font-medium">Password must be at least 8 characters long</p>
                )}
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password[0]}</p>}
              </div>

              {/* Confirm Password */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    disabled={isSubmitting || password.length === 0}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-50 ${
                      password.length > 0 && passwordConfirm && !passwordsMatch
                        ? 'border-red-300 focus:ring-red-500'
                        : password.length > 0 && passwordConfirm && passwordsMatch
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting || password.length === 0}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {password && passwordConfirm && !passwordsMatch && (
                  <p className="text-red-600 text-sm mt-2 font-medium">Passwords do not match</p>
                )}
                {password && passwordConfirm && passwordsMatch && (
                  <p className="text-green-600 text-sm mt-2 font-medium">✓ Passwords match</p>
                )}
                {password.length === 0 && (
                  <p className="text-gray-500 text-sm mt-2">Enter a new password above to enable this field</p>
                )}
                {errors.password_confirmation && <p className="text-red-600 text-sm mt-1">{errors.password_confirmation[0]}</p>}
              </div>
            </div>
            
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => navigate('/users')} type="button" disabled={isSubmitting}>Cancel</Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting || !isPasswordValid}
              >
                {isSubmitting ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
