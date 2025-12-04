import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, RefreshCw, TrendingUp, Hotel, ArrowRight } from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchData();
    setTimeout(() => setIsVisible(true), 100);
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
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Calendar,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Confirmed',
      value: bookings.filter(b => b.status.toLowerCase() === 'confirmed').length,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: bookings.filter(b => b.status.toLowerCase() === 'pending').length,
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

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

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
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

        .skeleton-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .booking-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .booking-card:hover {
          transform: translateX(4px);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(168, 85, 247, 0.02) 100%);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .animation-delay-1 { animation-delay: 0.1s; }
        .animation-delay-2 { animation-delay: 0.2s; }
        .animation-delay-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Welcome back, {user?.name || 'Traveler'}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/landing')}
                className="px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all font-medium border border-gray-200 hover:border-gray-300 active:scale-95"
                title="Back to website"
              >
                Back to Website
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 font-medium active:scale-95"
                title="Refresh bookings"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-effect rounded-2xl p-6 h-32 skeleton-loading"></div>
                ))}
              </div>
              <div className="glass-effect rounded-2xl p-8 h-64 skeleton-loading"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`stat-card glass-effect rounded-2xl p-6 shadow-lg animation-delay-${index + 1} ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                          <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
                        </div>
                        <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                          <Icon className={`w-8 h-8 ${stat.textColor}`} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Active</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 mb-8 shadow-sm animate-slide-up">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Bookings List */}
              <div className={`glass-effect rounded-2xl shadow-xl overflow-hidden ${isVisible ? 'animate-slide-up animation-delay-3' : 'opacity-0'}`}>
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage and track all your hotel reservations</p>
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
                    <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
                    <button
                      onClick={() => navigate('/landing')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      <Hotel className="w-5 h-5" />
                      Browse Hotels
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {bookings.map((booking, index) => (
                      <div key={booking.id} className={`booking-card p-6 animate-scale-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {booking.product?.name || 'Hotel Booking'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${getStatusBadge(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                            {booking.product?.location && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{booking.product.location}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => navigate(`/my-bookings/${booking.id}`)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-md hover:shadow-lg active:scale-95"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Check-in</p>
                              <p className="font-semibold text-gray-900">{formatDate(booking.check_in)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Check-out</p>
                              <p className="font-semibold text-gray-900">{formatDate(booking.check_out)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Guests</p>
                              <p className="font-semibold text-gray-900">{booking.guests}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Total Price</p>
                              <p className="font-semibold text-gray-900">${booking.total_price || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-600 font-semibold mb-1">Special Notes</p>
                            <p className="text-gray-700 text-sm">{booking.notes}</p>
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
    </>
  );
}
