import { useState, useContext } from 'react';
import { NavigationContext, useAppToast } from '../../../App';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft, Upload } from 'lucide-react';
import apiService from '../../../services/api';
import { navigateWithDelay } from '../../../utils/delayedNavigation';
import img1 from '../../../assets/img/hotels/img1.jpg';
import img2 from '../../../assets/img/hotels/img2.jpg';
import img3 from '../../../assets/img/hotels/img3.jpg';
import img4 from '../../../assets/img/hotels/img4.jpg';
import img5 from '../../../assets/img/hotels/img5.jpg';
import img6 from '../../../assets/img/hotels/img6.jpg';

export default function Create() {
  const {} = useContext(NavigationContext);
  const navigate = useNavigate();
  const toast = useAppToast();
  const hotelImages = [img1, img2, img3, img4, img5, img6];
  const [selectedImageIndex, setSelectedImageIndex] = useState(Math.floor(Math.random() * hotelImages.length));
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const clearCustomImage = () => {
    setCustomImagePreview(null);
  };

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
        toast.success('Hotel created successfully');
        navigateWithDelay(navigate, '/hotels');
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                <select
                  title="Select hotel rating"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
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
            
            {/* Current Preview */}
            <div className="mb-6 rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <img
                src={customImagePreview || hotelImages[selectedImageIndex]}
                alt="Current hotel image"
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Upload Custom Image */}
            <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
              <label className="block">
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Click to upload custom image</span>
                  <span className="text-xs text-gray-500">or drag and drop (Max 5MB)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                  className="hidden"
                  title="Upload hotel image"
                />
              </label>
              {customImagePreview && (
                <button
                  type="button"
                  onClick={clearCustomImage}
                  className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                >
                  Clear custom image
                </button>
              )}
            </div>

            {/* Preset Images Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Or select from preset images:</label>
              <div className="grid grid-cols-3 gap-3 mb-2">
                {hotelImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      clearCustomImage();
                    }}
                    disabled={customImagePreview !== null || isLoading}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index && !customImagePreview
                        ? 'border-blue-600 ring-2 ring-blue-300'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${
                      customImagePreview !== null ? 'opacity-50 cursor-not-allowed' : ''
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
              <p className="text-sm text-gray-600">
                {customImagePreview ? 'Using custom image' : `Selected: Image ${selectedImageIndex + 1}`}
              </p>
            </div>
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
