import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Users, MapPin, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, ArrowLeft, Hotel, Moon, Trash2 } from 'lucide-react';
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
    price?: number;
  };
}

export default function MyBookings() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelingBookingId, setCancelingBookingId] = useState<number | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    fetchBookings();
    setTimeout(() => setIsVisible(true), 100);
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const calculateTotalPrice = (checkIn: string, checkOut: string, pricePerNight: number | undefined) => {
    if (!pricePerNight) return 0;
    const nights = calculateNights(checkIn, checkOut);
    return nights * pricePerNight;
  };

  const handleCancelBooking = async (bookingId: number) => {
    setIsCanceling(true);
    try {
      const response = await apiService.cancelBooking(bookingId);
      if (response.success) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
        if (booking?.id === bookingId) {
          setBooking({ ...booking, status: 'cancelled' });
        }
        setCancelModalOpen(false);
        setCancelingBookingId(null);
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (err: any) {
      console.error('Cancel error:', err);
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setIsCanceling(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .skeleton-loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="h-8 w-48 skeleton-loading rounded mb-4"></div>
              <div className="h-4 w-64 skeleton-loading rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .booking-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .booking-card:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .info-card {
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-gray-600 mt-2">View and manage your hotel reservations</p>
            </div>
            <button
              onClick={() => navigate('/landing')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all font-medium border border-gray-200 hover:border-gray-300 active:scale-95"
              title="Back to website"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Website
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 mb-8 shadow-sm animate-slide-up">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {id && booking ? (
            /* Booking Details View */
            <div className={`space-y-6 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
              <div className="glass-effect rounded-2xl shadow-xl p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">{booking.product?.name || 'Hotel Booking'}</h2>
                    {booking.product?.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <span className="text-lg">{booking.product.location}</span>
                      </div>
                    )}
                  </div>
                  <span className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 border shadow-md ${getStatusBadge(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div className="info-card p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 font-medium mb-2">Check-in</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <p className="font-bold text-gray-900">{formatDate(booking.check_in)}</p>
                    </div>
                  </div>

                  <div className="info-card p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-sm text-gray-600 font-medium mb-2">Check-out</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <p className="font-bold text-gray-900">{formatDate(booking.check_out)}</p>
                    </div>
                  </div>

                  <div className="info-card p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <p className="text-sm text-gray-600 font-medium mb-2">Number of Nights</p>
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-blue-600" />
                      <p className="font-bold text-gray-900 text-2xl">{calculateNights(booking.check_in, booking.check_out)}</p>
                    </div>
                  </div>

                  <div className="info-card p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <p className="text-sm text-gray-600 font-medium mb-2">Number of Guests</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <p className="font-bold text-gray-900 text-2xl">{booking.guests}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Booking Summary</h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-indigo-200">
                      <p className="text-gray-700 font-medium">Price per night</p>
                      <p className="font-semibold text-gray-900">${booking.product?.price || 0}</p>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-indigo-200">
                      <p className="text-gray-700 font-medium">Number of nights</p>
                      <p className="font-semibold text-gray-900">{calculateNights(booking.check_in, booking.check_out)}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-xl font-bold text-gray-900">Total Price</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${calculateTotalPrice(booking.check_in, booking.check_out, booking.product?.price)}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Special Requests</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                      <p className="text-gray-700 leading-relaxed">{booking.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Bookings
                  </button>
                  {booking.status.toLowerCase() !== 'cancelled' && (
                    <button
                      onClick={() => {
                        setCancelingBookingId(booking.id);
                        setCancelModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition-all font-semibold active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                      Cancel Booking
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/user-dashboard')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg active:scale-95"
                  >
                    <Hotel className="w-5 h-5" />
                    Dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Bookings List View */
            <div className={`glass-effect rounded-2xl shadow-xl overflow-hidden ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
                    <p className="text-sm text-gray-600 mt-1">Track and manage your reservations</p>
                  </div>
                  <Hotel className="w-8 h-8 text-indigo-600 opacity-50" />
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                    <AlertCircle className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">Start exploring amazing hotels!</p>
                  <button
                    onClick={() => navigate('/landing')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                  >
                    <Hotel className="w-5 h-5" />
                    Browse Hotels
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {bookings.map((b, index) => (
                    <div key={b.id} className="booking-card p-6 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {b.product?.name || 'Hotel Booking'}
                            </h3>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${getStatusBadge(b.status)}`}>
                              {getStatusIcon(b.status)}
                              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                            </span>
                          </div>
                          {b.product?.location && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{b.product.location}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => navigate(`/my-bookings/${b.id}`)}
                          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-md hover:shadow-lg active:scale-95"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Check-in</p>
                            <p className="font-semibold text-gray-900">{formatDate(b.check_in)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Calendar className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Check-out</p>
                            <p className="font-semibold text-gray-900">{formatDate(b.check_out)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Guests</p>
                            <p className="font-semibold text-gray-900">{b.guests}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Total Price</p>
                            <p className="font-semibold text-gray-900">${b.total_price || 'N/A'}</p>
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

        {/* Cancel Confirmation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-scale-in">
              <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  Cancel Booking
                </h2>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700 mb-2">Are you sure you want to cancel this booking?</p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. The booking will be marked as cancelled.
                </p>
              </div>
              <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setCancelModalOpen(false);
                    setCancelingBookingId(null);
                  }}
                  disabled={isCanceling}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => cancelingBookingId && handleCancelBooking(cancelingBookingId)}
                  disabled={isCanceling}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isCanceling ? 'Canceling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
