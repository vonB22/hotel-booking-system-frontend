import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '../services/api';

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

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const response = await api.request('/api/overview/stats', { method: 'GET' });
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
      const response = await api.request('/api/bookings', { method: 'GET' });
      const bookingsData = response.data as unknown as RecentBooking[];
      setRecentBookings(Array.isArray(bookingsData) ? bookingsData.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching bookings:', error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    void fetchStats();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 py-4">
      {/* Header */}
      <div className="page-header mb-6">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-white font-bold">
              <i className="fas fa-chart-line"></i>
              Dashboard Overview
            </h2>
            <p className="text-white opacity-90 text-sm">Welcome back! Here's what's happening with StayEase today.</p>
            <div className="text-white text-sm mt-2">
              <i className="fas fa-clock mr-1"></i>
              <span id="currentDate"></span>
            </div>
          </div>
          <button
            onClick={fetchStats}
            disabled={isRefreshing}
            className="bg-white text-primary px-6 py-2 rounded-lg font-semibold transition hover:bg-gray-100"
          >
            <i className={`fas fa-rotate-right mr-2 ${isRefreshing ? 'animate-spin' : ''}`}></i>
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card" style={{ '--card-color': '#667eea', '--card-color-end': '#764ba2', '--icon-bg-start': 'rgba(102, 126, 234, 0.1)', '--icon-bg-end': 'rgba(118, 75, 162, 0.1)' } as unknown as React.CSSProperties}>
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{stats?.users || 0}</div>
              <div className="stat-meta">
                <i className="fas fa-arrow-up"></i>
                <span>Active members</span>
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' } as unknown as React.CSSProperties}>
              <i className="fas fa-users text-2xl" style={{ color: '#667eea' } as unknown as React.CSSProperties}></i>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ '--card-color': '#10b981', '--card-color-end': '#059669', '--icon-bg-start': 'rgba(16, 185, 129, 0.1)', '--icon-bg-end': 'rgba(5, 150, 105, 0.1)' } as unknown as React.CSSProperties}>
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">Total Hotels</div>
              <div className="stat-value">{stats?.hotels || 0}</div>
              <div className="stat-meta">
                <i className="fas fa-building"></i>
                <span>Listed properties</span>
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)' } as unknown as React.CSSProperties}>
              <i className="fas fa-hotel text-2xl" style={{ color: '#10b981' } as unknown as React.CSSProperties}></i>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ '--card-color': '#f59e0b', '--card-color-end': '#d97706', '--icon-bg-start': 'rgba(245, 158, 11, 0.1)', '--icon-bg-end': 'rgba(217, 119, 6, 0.1)' } as unknown as React.CSSProperties}>
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{stats?.bookings || 0}</div>
              <div className="stat-meta">
                <i className="fas fa-hourglass-half"></i>
                <span>Pending: <strong>{stats?.bookings_pending || 0}</strong></span>
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)' } as unknown as React.CSSProperties}>
              <i className="fas fa-calendar-check text-2xl" style={{ color: '#f59e0b' } as unknown as React.CSSProperties}></i>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ '--card-color': '#8b5cf6', '--card-color-end': '#7c3aed', '--icon-bg-start': 'rgba(139, 92, 246, 0.1)', '--icon-bg-end': 'rgba(124, 58, 237, 0.1)' } as unknown as React.CSSProperties}>
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">User Roles</div>
              <div className="stat-value">{stats?.roles || 0}</div>
              <div className="stat-meta">
                <i className="fas fa-shield-halved"></i>
                <span>Access levels</span>
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)' } as unknown as React.CSSProperties}>
              <i className="fas fa-user-shield text-2xl" style={{ color: '#8b5cf6' } as unknown as React.CSSProperties}></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h5 className="flex items-center gap-2">
              <i className="fas fa-chart-pie"></i>
              Booking Status Distribution
            </h5>
            <span className="badge badge-info ml-auto">Live</span>
          </div>
          <div className="p-4" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' } as unknown as React.CSSProperties}>
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

        <div className="card">
          <div className="card-header">
            <h5 className="flex items-center gap-2">
              <i className="fas fa-chart-line"></i>
              Monthly Bookings Trend
            </h5>
            <span className="badge badge-info ml-auto">Live</span>
          </div>
          <div className="p-4" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' } as unknown as React.CSSProperties}>
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
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h5 className="flex items-center gap-2">
                <i className="fas fa-clock"></i>
                Recent Bookings
              </h5>
            </div>
            <div className="divide-y">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="font-semibold text-gray-900">{booking.user_name}</div>
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="inline-flex items-center gap-1 mr-4">
                        <i className="fas fa-hotel"></i>
                        {booking.hotel_name}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <i className="fas fa-calendar"></i>
                        {booking.check_in} → {booking.check_out}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <i className="fas fa-calendar-xmark text-3xl mb-2 block"></i>
                  No bookings available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="flex items-center gap-2">
                <i className="fas fa-bolt"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body space-y-2">
              <a href="/admin/bookings/create" className="btn-primary w-full justify-center">
                <i className="fas fa-calendar-plus"></i>
                New Booking
              </a>
              <a href="/admin/users" className="btn-success w-full justify-center">
                <i className="fas fa-user-plus"></i>
                Add Guest
              </a>
              <button className="btn-primary w-full justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' } as unknown as React.CSSProperties}>
                <i className="fas fa-file-export"></i>
                Export Report
              </button>
              <button className="btn-primary w-full justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' } as unknown as React.CSSProperties}>
                <i className="fas fa-cog"></i>
                Settings
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <div className="card-header">
              <h5 className="flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                System Status
              </h5>
            </div>
            <div className="card-body space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="badge badge-success">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <span className="badge badge-success">Connected</span>
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
};

export default Dashboard;
