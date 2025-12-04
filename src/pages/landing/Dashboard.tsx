import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import apiService from '../../services/api';

interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price?: number;
  status: string;
  notes?: string;
  product?: {
    id: number;
    name: string;
    location?: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch current user
      const userResponse = await apiService.getCurrentUser();
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data as unknown as User);
      }

      // Fetch user's bookings
      const bookingsResponse = await apiService.getBookings(1, 100);
      if (bookingsResponse.success && bookingsResponse.data) {
        setBookings(bookingsResponse.data as unknown as Booking[]);
      }
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await apiService.getBookings(1, 100);
      if (response.success && response.data) {
        setBookings(response.data as unknown as Booking[]);
      }
    } catch (err) {
      console.error('Failed to refresh bookings:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.name || 'Traveler'}!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/landing')}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              title="Back to website"
            >
              Back to Website
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              title="Refresh bookings"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-center text-gray-600">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-indigo-600 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Confirmed Bookings</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Bookings</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {bookings.filter(b => b.status.toLowerCase() === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-600 opacity-50" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 mb-8">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Bookings List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">My Bookings</h2>
              </div>

              {bookings.length === 0 ? (
                <div className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No bookings yet</p>
                  <button
                    onClick={() => navigate('/landing')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Browse Hotels
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold">
                              {booking.product?.name || 'Hotel Booking'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadge(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          {booking.product?.location && (
                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                              <MapPin className="w-4 h-4" />
                              {booking.product.location}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => navigate(`/my-bookings/${booking.id}`)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="text-xs text-gray-600">Check-in</p>
                            <p className="font-semibold">{formatDate(booking.check_in)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="text-xs text-gray-600">Check-out</p>
                            <p className="font-semibold">{formatDate(booking.check_out)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="text-xs text-gray-600">Guests</p>
                            <p className="font-semibold">{booking.guests}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="text-xs text-gray-600">Total Price</p>
                            <p className="font-semibold">${booking.total_price || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Notes</p>
                          <p className="text-gray-700">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
