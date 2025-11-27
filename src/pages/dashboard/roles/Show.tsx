import { useContext, useEffect, useState } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../Components/Button';
import apiService from '../../../services/api';
import { ArrowLeft, Shield, Check } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Record<string, Record<string, boolean>>;
  usersCount?: number;
}

export default function Show() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchRole();
  }, [id]);

  const fetchRole = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!id) return;
      const response = await apiService.getRole(id);
      if (response.success && response.data) {
        setRole(response.data as unknown as Role);
      } else {
        setError(response.message || 'Failed to fetch role');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading role details...</div>;
  }

  if (error || !role) {
    return (
      <div className="space-y-6">
        <p className="text-center text-red-600">{error || 'Role not found'}</p>
        <div className="text-center">
          <Button onClick={() => navigate('/roles')} variant="primary">
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  const permissionsData = role.permissions || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/roles')} className="p-2 hover:bg-gray-100 rounded-lg" title="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl">{role.name}</h1>
            <p className="text-gray-600">Role #{role.id}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/roles/${id}/edit`)}>Edit Role</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Role Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p>{role.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p>{role.description || 'No description available'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Permissions</h3>
            {Object.keys(permissionsData).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(permissionsData).map(([module, perms]) => (
                  <div key={module}>
                    <h4 className="capitalize mb-2 font-semibold">{module}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(perms).map(([action, granted]) => (
                        <div key={action} className="flex items-center gap-2">
                          <Check className={`w-4 h-4 ${granted ? 'text-green-600' : 'text-gray-300'}`} />
                          <span className="text-sm capitalize">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No permissions defined</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="p-3 bg-blue-100 rounded-lg mb-4">
              <Shield className="w-8 h-8 text-blue-600 mx-auto" />
            </div>
            <h3 className="text-lg mb-4 text-center">Statistics</h3>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Users with this role</p>
                <p className="text-3xl mt-2">{role.usersCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
