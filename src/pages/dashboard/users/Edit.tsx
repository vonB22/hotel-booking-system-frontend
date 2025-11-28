import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  roles?: string[];
  status?: string;
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
    phone: '',
    role: 'User',
    status: 'Active',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

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
          phone: userData.phone || '',
          role: roleValue,
          status: statusValue,
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
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      };
      console.log('Submitting user data:', submitData);
      
      const response = await apiService.updateUser(id, submitData as any);

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
              <FormInput label="Phone" type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={isSubmitting} />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone[0]}</p>}
            </div>
            <div>
              <FormInput label="Role" options={[{ value: 'Admin', label: 'Admin' }, { value: 'User', label: 'User' }]} value={formData.role || 'User'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} disabled={isSubmitting} />
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role[0]}</p>}
            </div>
            <div>
              <FormInput label="Status" options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} value={formData.status || 'Active'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} disabled={isSubmitting} />
              {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status[0]}</p>}
            </div>
            
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => navigate('/users')} type="button" disabled={isSubmitting}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update User'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
