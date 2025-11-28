import { useState, useContext } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../../services/api';

export default function Create() {
  const { } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: formData.role,
      };

      const response = await apiService.createUser(submitData as any);

      if (response.success) {
        navigate('/users');
      } else {
        setError(response.message || 'Failed to create user');
      }
    } catch (err: any) {
      console.error('Create error:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setError(err.message || 'An error occurred while creating user');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'User', label: 'User' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/users')} className="p-2 hover:bg-gray-100 rounded-lg" title="Back to users" aria-label="Back to users">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">Add New User</h1>
          <p className="text-gray-600">Create a new user account</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

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
            <FormInput label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required disabled={isSubmitting} />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password[0]}</p>}
          </div>
          <div>
            <FormInput label="Confirm Password" type="password" value={formData.password_confirmation} onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} required disabled={isSubmitting} />
            {errors.password_confirmation && <p className="text-red-600 text-sm mt-1">{errors.password_confirmation[0]}</p>}
          </div>
          <div>
            <FormInput label="Role" options={roleOptions} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required disabled={isSubmitting} />
            {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role[0]}</p>}
          </div>
          
          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/users')} type="button" disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create User'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
