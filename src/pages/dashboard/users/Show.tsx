import { useContext, useEffect, useState } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../Components/Button';
import apiService from '../../../services/api';
import { ArrowLeft, Mail, Shield, Eye, EyeOff } from 'lucide-react';

export default function Show() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [user, setUser] = useState<any | null>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('User ID not found');
      setLoading(false);
      return;
    }
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch user details
        const userResponse = await apiService.getUser(id);
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
        } else {
          setError(userResponse.message || 'Failed to load user');
          setUser(null);
        }

        // Fetch all bookings and filter by user_id
        const bookingsResponse = await apiService.getBookings(1, 1000);
        if (bookingsResponse.success && Array.isArray(bookingsResponse.data)) {
          const userBookingsList = bookingsResponse.data.filter((b: any) => b.user_id === Number(id));
          setUserBookings(userBookingsList);
        } else {
          setUserBookings([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch user data:', err);
        setError(err.message || 'An error occurred while fetching user');
        setUser(null);
        setUserBookings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/users')} title="Back to users" aria-label="Back to users" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl">User Not Found</h1>
          </div>
        </div>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error || 'User not found or failed to load'}
        </div>
        <Button onClick={() => navigate('/users')} variant="outline">Back to Users</Button>
      </div>
    );
  }

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
        <Button variant="outline" onClick={() => navigate(`/users/${id}/edit`)}>Edit User</Button>
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Credentials</h3>
            <div className="space-y-3">
              <div className="relative">
                <p className="text-sm text-gray-600 mb-2">Password</p>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={user.password && user.password.trim() ? user.password : 'N/A'}
                    readOnly
                    title="User password"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">The user's password in plain text. Use this to help users who forgot their password</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Activity Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{userBookings.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${userBookings.reduce((sum: number, b: any) => sum + (Number(b.total_price) || 0), 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* User Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Recent Bookings</h3>
            {userBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Booking ID</th>
                      <th className="px-4 py-2 text-left">Hotel</th>
                      <th className="px-4 py-2 text-left">Check-in</th>
                      <th className="px-4 py-2 text-left">Check-out</th>
                      <th className="px-4 py-2 text-left">Guests</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userBookings.slice(0, 5).map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">#{booking.id}</td>
                        <td className="px-4 py-2">{booking.hotel?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{new Date(booking.check_in).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{new Date(booking.check_out).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-center">{booking.guests}</td>
                        <td className="px-4 py-2 font-semibold">${Number(booking.total_price || 0).toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userBookings.length > 5 && (
                  <p className="text-sm text-gray-500 mt-2">Showing 5 of {userBookings.length} bookings</p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No bookings yet</p>
            )}
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
