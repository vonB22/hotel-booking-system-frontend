import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Users, MapPin, DollarSign, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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

export default function MyBookings() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [id]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getBookings(1, 100);
      if (response.success && response.data) {
        const data = response.data as unknown as Booking[];
        setBookings(data);

        if (id) {
          const foundBooking = data.find(b => b.id === parseInt(id));
          setBooking(foundBooking || null);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
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
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-center text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage your hotel bookings</p>
          </div>
          <button
            onClick={() => navigate('/landing')}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all font-semibold"
            title="Back to website"
          >
            Back to Website
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 mb-8">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {id && booking ? (
          /* Booking Details View */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{booking.product?.name || 'Hotel Booking'}</h2>
                  {booking.product?.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      {booking.product.location}
                    </div>
                  )}
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getStatusBadge(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Check-in</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <p className="font-semibold">{formatDate(booking.check_in)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Check-out</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <p className="font-semibold">{formatDate(booking.check_out)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Number of Nights</p>
                  <p className="font-semibold text-lg">{calculateNights(booking.check_in, booking.check_out)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Number of Guests</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <p className="font-semibold">{booking.guests}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">Price per night</p>
                    <p className="font-semibold">Calculated</p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">Number of nights</p>
                    <p className="font-semibold">{calculateNights(booking.check_in, booking.check_out)}</p>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <p className="font-bold">Total Price</p>
                    <p className="text-2xl font-bold text-indigo-600">${booking.total_price || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">Special Requests</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700">{booking.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                >
                  Back to Bookings
                </button>
                <button
                  onClick={() => navigate('/user-dashboard')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Bookings List View */
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">All Bookings</h2>
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
                {bookings.map((b) => (
                  <div key={b.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold">
                            {b.product?.name || 'Hotel Booking'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadge(b.status)}`}>
                            {getStatusIcon(b.status)}
                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                          </span>
                        </div>
                        {b.product?.location && (
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4" />
                            {b.product.location}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/my-bookings/${b.id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Check-in</p>
                          <p className="font-semibold">{formatDate(b.check_in)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Check-out</p>
                          <p className="font-semibold">{formatDate(b.check_out)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Guests</p>
                          <p className="font-semibold">{b.guests}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Total Price</p>
                          <p className="font-semibold">${b.total_price || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
