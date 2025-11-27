import { useContext } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Components/Button';
import { Eye, Calendar } from 'lucide-react';

export default function Index() {
  const { setCurrentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();

  const userBookings = [
    { id: '1', hotel: 'Luxury Resort & Spa', checkIn: '2024-01-15', checkOut: '2024-01-20', status: 'Confirmed', total: 1250 },
    { id: '2', hotel: 'Mountain View Hotel', checkIn: '2024-02-10', checkOut: '2024-02-12', status: 'Upcoming', total: 360 },
    { id: '3', hotel: 'Beach Paradise Inn', checkIn: '2023-12-20', checkOut: '2023-12-25', status: 'Completed', total: 600 },
  ];

  const handleView = (id: string) => {
    setCurrentItemId(id);
    navigate(`/bookings/${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">My Bookings</h1>
        <p className="text-gray-600">View and manage your hotel bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden skeleton-card">
            <div className="h-48 bg-gray-200 skeleton-shimmer" />
            <div className="p-4">
              <h3 className="text-lg mb-2">{booking.hotel}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Check-in: {booking.checkIn}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Check-out: {booking.checkOut}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
                <span className="text-lg">${booking.total}</span>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleView(booking.id)}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {userBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No bookings yet</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/landing')}>
            Browse Hotels
          </Button>
        </div>
      )}
    </div>
  );
}
