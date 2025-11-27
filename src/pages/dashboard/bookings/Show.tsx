import { useContext, useEffect, useState } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../Components/Button';
import apiService from '../../../services/api';
import { ArrowLeft, MapPin, Users, Mail, Phone } from 'lucide-react';

export default function Show() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [booking, setBooking] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBooking = async () => {
      try {
        const response = await apiService.getBooking(id);
        if (response.success && response.data) {
          setBooking(response.data);
        } else {
          setBooking(null);
        }
      } catch (err) {
        console.error('Failed to fetch booking', err);
        setBooking(null);
      }
    };
    fetchBooking();
  }, [id]);

  if (!booking) {
    return <div className="text-center py-8 text-red-600">Booking not found or failed to load</div>;
  }

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
          <Button variant="outline" onClick={() => navigate(`/bookings/${id}/edit`)}>
            Edit Booking
          </Button>
          <Button variant="primary">
            Print
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
                  <p>{booking.guestName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p>{booking.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p>{booking.phone}</p>
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
                  <p>{booking.hotel}</p>
                  <p className="text-sm text-gray-500">{booking.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p>{booking.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p>{booking.checkOut}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Room Type</p>
                <p>{booking.roomType}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Adults</p>
                  <p>{booking.adults}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Children</p>
                  <p>{booking.children}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Nights</p>
                <p>{booking.nights}</p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Special Requests</h3>
            <p className="text-gray-700">{booking.specialRequests}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">Status</h3>
            <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 inline-block">
              {booking.status}
            </span>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Pricing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per night</span>
                <span>${booking.pricePerNight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of nights</span>
                <span>{booking.nights}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span>Total Amount</span>
                <span className="text-xl">${booking.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">Booking Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Booking Date</p>
                <p>{booking.bookingDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p>#{booking.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
