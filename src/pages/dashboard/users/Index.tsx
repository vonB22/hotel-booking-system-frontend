import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Components/Button';
import Modal from '../../../Components/Modal';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import apiService from '../../../services/api';

interface User {
  id: number | string;
  name: string;
  email: string;
  role?: string | string[];
  roles?: string[];
  status?: string;
  created_at?: string;
}

// Helper to return Tailwind classes based on role
const getRoleBadgeClasses = (role: string | undefined | null) => {
  const safeRole = (role || '').toLowerCase();
  switch (safeRole) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'manager':
      return 'bg-purple-100 text-purple-800';
    case 'user':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Index() {
  const { setCurrentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getUsers();
      console.log('Users API response:', response);
      if (response.data && Array.isArray(response.data)) {
        console.log('Users from array:', response.data);
        setUsers(response.data as User[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const paginatedData = (response.data as any).data;
        console.log('Users from paginated data:', paginatedData);
        setUsers(Array.isArray(paginatedData) ? paginatedData : []);
      } else {
        console.log('No data found in response');
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      let errorMessage = 'Failed to load users';
      if (error.status === 403) {
        errorMessage = 'Access Denied: You do not have permission to view users.';
        if (error.message) {
          errorMessage += ` (${error.message})`;
        }
      } else if (error.status === 401) {
        errorMessage = 'Authentication Required: Please log in again.';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      setError(errorMessage);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || userRoles.includes(filterRole);
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string | number) => {
    setSelectedId(String(id));
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteUser(selectedId);
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Add User */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Users</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/users/create')} disabled={error !== ''}>
          <Plus className="w-5 h-5 inline mr-2" />
          Add User
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-semibold">Error Loading Users</div>
          <div className="text-red-700 mt-1">{error}</div>
          <button
            onClick={fetchUsers}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-800">Loading users...</div>
        </div>
      )}

      {/* Users Table */}
      {!error && !isLoading && (
        <>
          {/* Search + Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <select
                title="Filter by role"
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const userRoles = user.roles || (user.role ? (Array.isArray(user.role) ? user.role : [user.role]) : []);
                    console.log(`User ${user.id} roles:`, userRoles);
                    return (
                      <tr key={user.id}>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          {userRoles && userRoles.length > 0 ? (
                            userRoles.map((role, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1 mr-1 rounded-full text-sm ${getRoleBadgeClasses(role)}`}
                              >
                                {role || 'No Role'}
                              </span>
                            ))
                          ) : (
                            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">No Role</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              user.status === 'Active' || user.status === 'active' ? 'bg-green-100 text-green-800' : user.status === 'Inactive' || user.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title="View user"
                              onClick={() => {
                                setCurrentItemId(String(user.id));
                                navigate(`/users/${user.id}`);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              title="Edit user"
                              onClick={() => {
                                setCurrentItemId(String(user.id));
                                navigate(`/users/${user.id}/edit`);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              type="button"
                              title="Delete user"
                              onClick={() => handleDelete(user.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Delete Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete User"
            onConfirm={confirmDelete}
            confirmText="Delete"
            variant="danger"
          >
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          </Modal>
        </>
      )}
    </div>
  );
}
