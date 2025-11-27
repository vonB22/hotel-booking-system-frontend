import { useContext, useState, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../Components/Button';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import apiService from '../../../services/api';
import img1 from '../../../assets/img/hotels/img1.jpg';
import img2 from '../../../assets/img/hotels/img2.jpg';
import img3 from '../../../assets/img/hotels/img3.jpg';
import img4 from '../../../assets/img/hotels/img4.jpg';
import img5 from '../../../assets/img/hotels/img5.jpg';
import img6 from '../../../assets/img/hotels/img6.jpg';

interface Hotel {
  id: number;
  name: string;
  detail: string;
  location: string;
  price: number;
  rooms: number;
  rating: number;
  amenities: string;
  image?: string;
}

export default function Show() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getHotel(id);
      if (response.success && response.data) {
        const hotelData = response.data as unknown as Hotel;
        setHotel(hotelData);
      } else {
        setError(response.message || 'Failed to fetch hotel');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching hotel');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="text-center text-gray-600">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="space-y-6">
        <p className="text-center text-red-600">{error || 'Hotel not found'}</p>
        <div className="text-center">
          <Button onClick={() => navigate('/hotels')} variant="primary">
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  const amenitiesList = (hotel.amenities || '')
    .split(',')
    .map(a => a.trim())
    .filter(a => a.length > 0);

  const hotelImages = [img1, img2, img3, img4, img5, img6];

  const getHotelImage = (): string => {
    if (!hotel.image) {
      return hotelImages[(hotel.id - 1) % hotelImages.length];
    }

    const filename = hotel.image.split('/').pop() || '';

    if (filename.startsWith('img') && filename.endsWith('.jpg')) {
      const imgNum = filename.match(/\d+/)?.[0];
      if (imgNum && parseInt(imgNum) <= 6) {
        return hotelImages[parseInt(imgNum) - 1];
      }
    }

    return hotelImages[(hotel.id - 1) % hotelImages.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/hotels')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Go back to hotels"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl">{hotel.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <p className="text-gray-600">{hotel.location}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/hotels/${id}/edit`)}>
            Edit Hotel
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src={getHotelImage()}
          alt={hotel.name}
          className="w-full h-96 object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">About This Property</h3>
            <p className="text-gray-700">{hotel.detail}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4 border-b pb-2">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">Hotel Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>{hotel.rating}/5</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rooms</p>
                <p>{hotel.rooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p>{hotel.location}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">Pricing</h3>
            <div>
              <p className="text-sm text-gray-600">Starting from</p>
              <div className="mt-2">
                <span className="text-3xl">${hotel.price}</span>
                <span className="text-gray-600">/night</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
