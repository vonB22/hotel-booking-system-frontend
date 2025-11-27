import { useContext, useEffect, useState } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../Components/Button';
import apiService from '../../../services/api';
import { ArrowLeft, Mail, Phone, Shield } from 'lucide-react';

export default function Show() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const id = params.id || currentItemId || null;
    if (!id) return;
    const fetchUser = async () => {
      try {
        const response = await apiService.getUser(id);
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUser(null);
      }
    };
    fetchUser();
  }, [params.id]);

  if (!user) return (<div>Loading user...</div>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/users')} title="Back to users" aria-label="Back to users" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl">{user.name}</h1>
            <p className="text-gray-600">User #{user.id}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/users/${currentItemId}/edit`)}>Edit User</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div><p className="text-sm text-gray-600">Email</p><p>{user.email}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div><p className="text-sm text-gray-600">Phone</p><p>{user.phone}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Activity Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-600">Total Bookings</p><p className="text-2xl">{user.bookingsCount}</p></div>
              <div><p className="text-sm text-gray-600">Total Spent</p><p className="text-2xl">${user.totalSpent}</p></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">Account Details</h3>
            <div className="space-y-3">
              <div><p className="text-sm text-gray-600">Role</p><span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm mt-1"><Shield className="w-3 h-3 inline mr-1" />{user.role}</span></div>
              <div><p className="text-sm text-gray-600">Status</p><span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm mt-1">{user.status}</span></div>
              <div><p className="text-sm text-gray-600">Member Since</p><p>{user.joined}</p></div>
              <div><p className="text-sm text-gray-600">Last Login</p><p>{user.lastLogin}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
