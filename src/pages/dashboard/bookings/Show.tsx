import { useContext, useEffect, useState } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../Components/Button';
import apiService from '../../../services/api';
import { ArrowLeft, MapPin, Users, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface Booking {
  id: number;
  user_id?: number;
  product_id?: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price?: number;
  status: string;
  notes?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
    location?: string;
    price?: number;
  };
}

export default function Show() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetchBooking = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiService.getBooking(id);
        if (response.success && response.data) {
          setBooking(response.data as unknown as Booking);
        } else {
          setError(response.message || 'Failed to fetch booking');
        }
      } catch (err) {
        console.error('Failed to fetch booking', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching booking');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    } catch {
      return 0;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'confirmed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/bookings')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Booking Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Error Loading Booking</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={() => navigate('/bookings')}
              className="mt-3 text-red-600 hover:text-red-800 font-medium text-sm"
            >
              ← Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/bookings')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Booking Details</h1>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-800 font-medium">Booking Not Found</p>
            <p className="text-yellow-600 text-sm mt-1">The booking you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/bookings')}
              className="mt-3 text-yellow-600 hover:text-yellow-800 font-medium text-sm"
            >
              ← Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.check_in, booking.check_out);
  const pricePerNight = parseFloat(String(booking.product?.price || 0));
  const totalPrice = parseFloat(String(booking.total_price || (pricePerNight * nights)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/bookings')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Back to bookings"
            aria-label="Back to bookings"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl">Booking Details</h1>
            <p className="text-gray-600">Booking #{booking.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/bookings/${booking.id}/edit`)}>
            Edit Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Guest Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Guest Name</p>
                  <p>{booking.user?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p>{booking.user?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Number of Guests</p>
                  <p>{booking.guests}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel & Stay Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Hotel & Stay Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Hotel</p>
                  <p>{booking.product?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{booking.product?.location || 'Location not available'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(booking.check_in)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(booking.check_out)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Nights</p>
                <p>{nights} {nights === 1 ? 'night' : 'nights'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number of Guests</p>
                <p>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Special Requests / Notes</h3>
            <p className="text-gray-700">{booking.notes || 'No special requests'}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">Status</h3>
            <span className={`px-4 py-2 rounded-full inline-block font-medium ${getStatusColor(booking.status)}`}>
              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Pricing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price per night
                </span>
                <span className="font-medium">${pricePerNight.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of nights</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">Booking Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-mono">#{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p>{booking.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
