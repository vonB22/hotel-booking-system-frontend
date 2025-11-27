import { useState, useContext } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../../services/api';
import img1 from '../../../assets/img/hotels/img1.jpg';
import img2 from '../../../assets/img/hotels/img2.jpg';
import img3 from '../../../assets/img/hotels/img3.jpg';
import img4 from '../../../assets/img/hotels/img4.jpg';
import img5 from '../../../assets/img/hotels/img5.jpg';
import img6 from '../../../assets/img/hotels/img6.jpg';

export default function Create() {
  const {} = useContext(NavigationContext);
  const navigate = useNavigate();
  const hotelImages = [img1, img2, img3, img4, img5, img6];
  const [selectedImageIndex, setSelectedImageIndex] = useState(Math.floor(Math.random() * hotelImages.length));
  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    location: '',
    price: '',
    rooms: '',
    rating: '',
    amenities: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setIsLoading(true);

    try {
      const amenitiesList = (formData.amenities || '')
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const response = await apiService.createHotel({
        name: formData.name,
        detail: formData.detail,
        location: formData.location,
        price: formData.price ? parseFloat(formData.price) : undefined,
        rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
        rating: formData.rating ? parseInt(formData.rating) : undefined,
        amenities: amenitiesList,
        image: `img${selectedImageIndex + 1}.jpg`,
      });

      console.log('Create response:', response);

      if (response.success) {
        navigate('/hotels');
      } else {
        setError(response.message || 'Failed to create hotel');
      }
    } catch (err: any) {
      console.error('Create error:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setError(err.message || 'An error occurred while creating hotel');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/hotels')}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Go back to hotels"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">Add New Hotel</h1>
          <p className="text-gray-600">Fill in the details to add a new hotel</p>
        </div>
      </div>

      {/* Sample Image Preview */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src={hotelImages[selectedImageIndex]}
          alt="Selected hotel image"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <FormInput
                  label="Hotel Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>}
              </div>
              <div>
                <FormInput
                  label="Description"
                  textarea
                  rows={4}
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  required
                  disabled={isLoading}
                />
                {errors.detail && <p className="text-red-600 text-sm mt-1">{errors.detail[0]}</p>}
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Location Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <FormInput
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Maldives, Switzerland, Bali"
                  disabled={isLoading}
                />
                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location[0]}</p>}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormInput
                  label="Price Per Night ($)"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={isLoading}
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price[0]}</p>}
              </div>
              <div>
                <FormInput
                  label="Total Rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  disabled={isLoading}
                />
                {errors.rooms && <p className="text-red-600 text-sm mt-1">{errors.rooms[0]}</p>}
              </div>
              <div>
                <FormInput
                  label="Rating (1-5)"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  disabled={isLoading}
                />
                {errors.rating && <p className="text-red-600 text-sm mt-1">{errors.rating[0]}</p>}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Amenities</h3>
            <div>
              <FormInput
                label="Amenities (comma-separated)"
                textarea
                rows={3}
                placeholder="WiFi, Pool, Gym, Spa, Restaurant, Bar, Parking"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                disabled={isLoading}
              />
              {errors.amenities && <p className="text-red-600 text-sm mt-1">{errors.amenities[0]}</p>}
            </div>
          </div>

          {/* Hotel Image Selection */}
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Hotel Image</h3>
            <div className="grid grid-cols-3 gap-3">
              {hotelImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-600' : 'border-gray-300'
                  }`}
                  title={`Select image ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`Hotel image ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Selected: Image {selectedImageIndex + 1}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 justify-end pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => navigate('/hotels')}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Add Hotel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
