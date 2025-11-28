import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Components/Button';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import apiService from '../../../services/api';

interface Booking {
  id: number;
  user_id: number;
  product_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  notes: string;
}

export default function Index() {
  const { setCurrentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getBookings();
      if (response.success && response.data) {
        setBookings(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.message || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (err: any) {
      const errorMsg = err?.message || err?.error || 'An error occurred while fetching bookings';
      setError(errorMsg);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedId === null) return;

    try {
      const response = await apiService.deleteBooking(selectedId);
      if (response.success) {
        setBookings(bookings.filter(b => b.id !== selectedId));
        setIsDeleteModalOpen(false);
        setSelectedId(null);
      } else {
        setError(response.message || 'Failed to delete booking');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting booking');
    }
  };

  const handleEdit = (id: number) => {
    setCurrentItemId(String(id));
    navigate(`/bookings/${id}/edit`);
  };

  const handleShow = (id: number) => {
    setCurrentItemId(String(id));
    navigate(`/bookings/${id}`);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      String(booking.id).includes(searchTerm) ||
      booking.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Bookings</h1>
          <p className="text-gray-600">Manage all hotel bookings</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/bookings/create')}
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Create Booking
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg skeleton-input"
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg skeleton-input"
            title="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 text-center text-gray-600">Loading bookings...</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && filteredBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm">ID</th>
                  <th className="px-6 py-3 text-left text-sm">Check-in</th>
                  <th className="px-6 py-3 text-left text-sm">Check-out</th>
                  <th className="px-6 py-3 text-left text-sm">Guests</th>
                  <th className="px-6 py-3 text-left text-sm">Price</th>
                  <th className="px-6 py-3 text-left text-sm">Status</th>
                  <th className="px-6 py-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="skeleton-table-row">
                    <td className="px-6 py-4">#{booking.id}</td>
                    <td className="px-6 py-4">{booking.check_in}</td>
                    <td className="px-6 py-4">{booking.check_out}</td>
                    <td className="px-6 py-4">{booking.guests}</td>
                    <td className="px-6 py-4">${booking.total_price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShow(booking.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View booking"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleEdit(booking.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit booking"
                        >
                          <Edit className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete booking"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredBookings.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No bookings found</p>
          {searchTerm || statusFilter ? (
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
          ) : (
            <p className="text-gray-500 text-sm mt-2">Create your first booking to get started</p>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideScaleUp {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
              20%, 40%, 60%, 80% { transform: translateX(2px); }
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out;
            }
            .animate-modal-in {
              animation: slideScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .delete-icon-shake:hover {
              animation: shake 0.5s ease-in-out;
            }
          `}</style>
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full animate-modal-in border border-gray-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center delete-icon-shake">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Delete Booking</h2>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
