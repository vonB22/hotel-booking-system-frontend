import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Components/Button';
import { Plus, Eye, Edit, Trash2, Search, Star, X } from 'lucide-react';
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
  location: string;
  price: number;
  rating: number;
  rooms: number;
  detail: string;
  image?: string;
  amenities?: string;
}

export default function Index() {
  const { setCurrentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getHotels();
      if (response.success && response.data) {
        setHotels(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.message || 'Failed to fetch hotels');
        setHotels([]);
      }
    } catch (err: any) {
      const errorMsg = err?.message || err?.error || 'An error occurred while fetching hotels';
      setError(errorMsg);
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (hotel: Hotel) => {
    setSelectedId(hotel.id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedId === null) return;
    setIsDeleting(true);

    try {
      const response = await apiService.deleteHotel(selectedId);
      if (response.success) {
        setHotels(hotels.filter(h => h.id !== selectedId));
        setIsDeleteModalOpen(false);
        setSelectedId(null);
        setIsDeleting(false);
      } else {
        setError(response.message || 'Failed to delete hotel');
        setIsDeleting(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting hotel');
      setIsDeleting(false);
    }
  };

  const handleEdit = (id: number) => {
    setCurrentItemId(String(id));
    navigate(`/hotels/${id}/edit`);
  };

  const handleShow = (id: number) => {
    setCurrentItemId(String(id));
    navigate(`/hotels/${id}`);
  };

  const filteredHotels = hotels.filter(hotel => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(term) ||
      hotel.location.toLowerCase().includes(term)
    );
  });

  const hotelImages = [img1, img2, img3, img4, img5, img6];

  const getHotelImage = (hotel: Hotel, index: number): string => {
    if (!hotel.image) {
      return hotelImages[index % hotelImages.length];
    }

    const filename = hotel.image.split('/').pop() || '';

    if (filename.startsWith('img') && filename.endsWith('.jpg')) {
      const imgNum = filename.match(/\d+/)?.[0];
      if (imgNum && parseInt(imgNum) <= 6) {
        return hotelImages[parseInt(imgNum) - 1];
      }
    }

    return hotelImages[index % hotelImages.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Hotels</h1>
          <p className="text-gray-600">Manage all hotels in the system</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/hotels/create')}
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Add Hotel
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
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg skeleton-input"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden skeleton-card">
              <div className="h-48 bg-gray-200 skeleton-shimmer" />
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded skeleton-shimmer mb-2" />
                <div className="h-4 bg-gray-200 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {!isLoading && filteredHotels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, index) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow overflow-hidden skeleton-card">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={getHotelImage(hotel, index)}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm">{hotel.rating}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl">${hotel.price}</span>
                    <span className="text-gray-600 text-sm">/night</span>
                  </div>
                  <span className="text-sm text-gray-600">{hotel.rooms} rooms</span>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleShow(hotel.id)}
                    className="flex-1 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View hotel details"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(hotel.id)}
                    className="flex-1 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit hotel"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hotel)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete hotel"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredHotels.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No hotels found</p>
          {searchTerm ? (
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
          ) : (
            <p className="text-gray-500 text-sm mt-2">Add your first hotel to get started</p>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
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
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out;
            }
            .animate-modal-in {
              animation: slideScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .delete-icon-shake:hover {
              animation: shake 0.4s ease-in-out;
            }
          `}</style>
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-modal-in border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center delete-icon-shake">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Delete Hotel</h2>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to delete this hotel? This action cannot be undone and all associated data will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
