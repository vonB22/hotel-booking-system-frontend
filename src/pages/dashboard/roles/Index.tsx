import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Components/Button';
import Modal from '../../../Components/Modal';
import { Plus, Eye, Edit, Trash2, Shield } from 'lucide-react';
import apiService from '../../../services/api';

interface Role {
  id: number | string;
  name: string;
  permissions?: number;
  created_at?: string;
  updated_at?: string;
}

export default function Index() {
  const { setCurrentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getRoles();
      if (response.success) {
        if (response.data && Array.isArray(response.data)) {
          setRoles(response.data as unknown as Role[]);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          const paginatedData = (response.data as any).data;
          setRoles(Array.isArray(paginatedData) ? paginatedData : []);
        } else {
          setRoles([]);
        }
      } else {
        setError(response.message || 'Failed to load roles');
        setRoles([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch roles:', err);
      let errorMessage = 'Failed to load roles';
      if (err.status === 403) {
        errorMessage = 'Access Denied: You do not have permission to view roles.';
      } else if (err.status === 401) {
        errorMessage = 'Authentication Required: Please log in again.';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = err.error;
      }
      setError(errorMessage);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string | number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await apiService.deleteRole(selectedId);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
      fetchRoles();
    } catch (err: any) {
      console.error('Failed to delete role:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Roles & Permissions</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/roles/create')} disabled={error !== ''}>
          <Plus className="w-5 h-5 inline mr-2" />
          Create Role
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-semibold">Error Loading Roles</div>
          <div className="text-red-700 mt-1">{error}</div>
          <button 
            onClick={fetchRoles}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-800">Loading roles...</div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.length > 0 ? (
            roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow p-6 skeleton-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl mb-2">{role.name}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y">
                  <div><p className="text-sm text-gray-600">Permissions</p><p className="text-2xl">{role.permissions || 0}</p></div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { setCurrentItemId(String(role.id)); navigate(`/roles/${role.id}`); }} 
                    className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium" 
                    title="View"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />View
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setCurrentItemId(String(role.id)); navigate(`/roles/${role.id}/edit`); }} 
                    className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium" 
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />Edit
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDelete(role.id)} 
                    className="p-2 hover:bg-red-50 rounded-lg" 
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No roles found
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Role" 
        onConfirm={confirmDelete} 
        confirmText="Delete" 
        variant="danger"
      >
        <p>Are you sure you want to delete this role? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
