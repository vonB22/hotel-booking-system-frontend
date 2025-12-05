import { useEffect, useState } from 'react';
import { Users, Building2, Calendar, Shield, RotateCcw } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import apiService from '../../../services/api';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

interface StatsData {
  users: number;
  hotels: number;
  bookings: number;
  roles: number;
  bookings_pending: number;
  booking_status: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  monthly_bookings: number[];
}

interface RecentBooking {
  id: number;
  user_name: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
  status: string;
}

export default function Home() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const response = await apiService.getOverviewStats();
      const statsData = response.data as unknown as StatsData;
      if (statsData && typeof statsData === 'object') {
        setStats(statsData as StatsData);
      }
      await fetchRecentBookings();
    } catch (error) {
      console.error('Error fetching stats:', error instanceof Error ? error.message : String(error));
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await apiService.getBookings(1, 5);
      const bookingsData = response.data as unknown as RecentBooking[];
      setRecentBookings(Array.isArray(bookingsData) ? bookingsData.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching bookings:', error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    void fetchStats();
    setLoading(false);
    
    // Set current date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
      dateElement.textContent = dateString;
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold gradient-primary-text">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with StayEase today.</p>
          <div className="text-gray-600 text-sm mt-2">
            <span id="currentDate"></span>
          </div>
        </div>
        <button
          onClick={fetchStats}
          disabled={isRefreshing}
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2 rounded-lg font-semibold transition hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
        >
          <RotateCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.users || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Active members</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Hotels */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Hotels</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.hotels || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Listed properties</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.bookings || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Pending: <strong>{stats?.bookings_pending || 0}</strong></p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* User Roles */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">User Roles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.roles || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Access levels</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold gradient-primary-text">Booking Status Distribution</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="flex items-center justify-center h-80">
            {stats?.booking_status ? (
              <Doughnut
                data={{
                  labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
                  datasets: [{
                    data: [
                      stats.booking_status.pending,
                      stats.booking_status.confirmed,
                      stats.booking_status.completed,
                      stats.booking_status.cancelled
                    ],
                    backgroundColor: [
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(102, 126, 234, 0.8)',
                      'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                      'rgba(245, 158, 11, 1)',
                      'rgba(16, 185, 129, 1)',
                      'rgba(102, 126, 234, 1)',
                      'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                } as unknown as Record<string, unknown>}
              />
            ) : (
              <p className="text-gray-500">Loading chart...</p>
            )}
          </div>
        </div>

        {/* Monthly Bookings Trend */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold gradient-primary-text">Monthly Bookings Trend</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="flex items-center justify-center h-80">
            {stats?.monthly_bookings ? (
              <Bar
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  datasets: [{
                    label: 'Bookings',
                    data: stats.monthly_bookings,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                } as unknown as Record<string, unknown>}
              />
            ) : (
              <p className="text-gray-500">Loading chart...</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold gradient-primary-text">Recent Bookings</h3>
            </div>
            <div className="divide-y">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="font-semibold text-gray-900">{booking.user_name}</div>
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="inline-flex items-center gap-1 mr-4">
                        {booking.hotel_name}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {booking.check_in} → {booking.check_out}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No bookings available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold gradient-primary-text">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-2">
              <a href="/bookings/create" className="block w-full p-3 rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-center font-semibold hover:shadow-lg transition">
                New Booking
              </a>
              <a href="/users/create" className="block w-full p-3 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-center font-semibold hover:shadow-lg transition">
                Add Guest
              </a>
              <button className="w-full p-3 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-semibold hover:shadow-lg transition">
                Export Report
              </button>
              <button className="w-full p-3 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white font-semibold hover:shadow-lg transition">
                Settings
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold gradient-primary-text">System Status</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
