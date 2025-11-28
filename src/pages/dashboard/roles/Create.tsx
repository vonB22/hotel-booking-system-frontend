import { useState, useContext } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../../services/api';

export default function Create() {
  const {} = useContext(NavigationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', permissions: [] });
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
        permissions: formData.permissions,
      };

      const response = await apiService.createRole(submitData);

      if (response.success) {
        navigate('/roles');
      } else {
        setError(response.message || 'Failed to create role');
      }
    } catch (err: any) {
      console.error('Create error:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setError(err.message || 'An error occurred while creating role');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/roles')} className="p-2 hover:bg-gray-100 rounded-lg" title="Go back"><ArrowLeft className="w-5 h-5" /></button>
        <div><h1 className="text-3xl">Create New Role</h1><p className="text-gray-600">Define a new role</p></div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Role Information</h3>
            <div className="space-y-4">
              <div>
                <FormInput label="Role Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={isSubmitting} />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/roles')} type="button" disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Role'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
