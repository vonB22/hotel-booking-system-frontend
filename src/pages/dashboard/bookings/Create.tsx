import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../../services/api';

interface Hotel {
  id: number;
  name: string;
}

export default function Create() {
  const {} = useContext(NavigationContext);
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [formData, setFormData] = useState({
    product_id: '',
    check_in: '',
    check_out: '',
    guests: '',
    price: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await apiService.getHotels();
      if (response.success && response.data) {
        setHotels(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      console.error('Failed to fetch hotels:', err);
    } finally {
      setIsLoadingHotels(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setIsLoading(true);

    try {
      const response = await apiService.createBooking({
        product_id: formData.product_id ? parseInt(formData.product_id) : undefined,
        check_in: formData.check_in,
        check_out: formData.check_out,
        guests: parseInt(formData.guests) || 1,
        price: formData.price ? parseFloat(formData.price) : undefined,
        notes: formData.notes,
      });

      if (response.success) {
        navigate('/bookings');
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setError(err.message || 'An error occurred while creating booking');
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
          onClick={() => navigate('/bookings')}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Go back to bookings"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">Create New Booking</h1>
          <p className="text-gray-600">Fill in the details to create a new booking</p>
        </div>
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
          {/* Booking Details */}
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hotel" className="block text-sm text-gray-700 mb-2">
                  Hotel <span className="text-red-500">*</span>
                </label>
                <select
                  id="hotel"
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  required
                  disabled={isLoading || isLoadingHotels}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg skeleton-input"
                >
                  <option value="">Select a hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={String(hotel.id)}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
                {errors.product_id && <p className="text-red-600 text-sm mt-1">{errors.product_id[0]}</p>}
              </div>

              <div>
                <FormInput
                  label="Number of Guests"
                  type="number"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  required
                  disabled={isLoading}
                />
                {errors.guests && <p className="text-red-600 text-sm mt-1">{errors.guests[0]}</p>}
              </div>

              <div>
                <FormInput
                  label="Check-in Date"
                  type="date"
                  value={formData.check_in}
                  onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                  required
                  disabled={isLoading}
                />
                {errors.check_in && <p className="text-red-600 text-sm mt-1">{errors.check_in[0]}</p>}
              </div>

              <div>
                <FormInput
                  label="Check-out Date"
                  type="date"
                  value={formData.check_out}
                  onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                  required
                  disabled={isLoading}
                />
                {errors.check_out && <p className="text-red-600 text-sm mt-1">{errors.check_out[0]}</p>}
              </div>

              <div>
                <FormInput
                  label="Price Per Night"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={isLoading}
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price[0]}</p>}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Special Requests</h3>
            <FormInput
              label="Notes"
              textarea
              rows={4}
              placeholder="Add any special requests or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isLoading}
            />
            {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes[0]}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 justify-end pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => navigate('/bookings')}
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
              {isLoading ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
