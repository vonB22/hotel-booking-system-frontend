import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../../services/api';

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export default function Edit() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [formData, setFormData] = useState<Role>({
    id: 0,
    name: '',
    permissions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (id) {
      fetchRole();
    }
  }, [id]);

  const fetchRole = async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getRole(id);
      if (response.success && response.data) {
        const roleData = response.data as any;
        setFormData({
          id: roleData.id || 0,
          name: roleData.name || '',
          permissions: roleData.permissions || [],
        });
      } else {
        setError(response.message || 'Failed to fetch role');
      }
    } catch (err) {
      console.error('Error fetching role:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching role');
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
        permissions: formData.permissions,
      };

      const response = await apiService.updateRole(id, submitData);

      if (response.success) {
        navigate('/roles');
      } else {
        setError(response.message || 'Failed to update role');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setError(err.message || 'An error occurred while updating role');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/roles')} className="p-2 hover:bg-gray-100 rounded-lg" title="Back to roles" aria-label="Back to roles"><ArrowLeft className="w-5 h-5" /></button>
        <div><h1 className="text-3xl">Edit Role #{id}</h1><p className="text-gray-600">Update role details</p></div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-600">Loading role details...</p>
        </div>
      )}

      {!isLoading && (
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

            <div>
              <h3 className="text-lg mb-4 border-b pb-2">Permissions</h3>
              <div className="space-y-4">
                {['Bookings', 'Hotels', 'Users', 'Roles'].map((module) => (
                  <div key={module}>
                    <h4 className="mb-2 font-medium">{module}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['view', 'create', 'edit', 'delete'].map((action) => {
                        const permissionName = `${module.toLowerCase()}.${action}`;
                        const isChecked = formData.permissions.includes(permissionName);
                        return (
                          <label key={action} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={(e) => {
                                const newPermissions = e.target.checked 
                                  ? [...formData.permissions, permissionName]
                                  : formData.permissions.filter(p => p !== permissionName);
                                setFormData({ ...formData, permissions: newPermissions });
                              }}
                              className="rounded"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm capitalize">{action}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => navigate('/roles')} type="button" disabled={isSubmitting}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update Role'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
