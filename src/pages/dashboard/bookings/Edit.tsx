import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../../services/api';

interface Booking {
  id: number;
  user_id?: number;
  product_id?: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price?: number;
  status: string;
  notes?: string;
}

export default function Edit() {
  const { currentItemId } = useContext(NavigationContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || currentItemId;
  const [formData, setFormData] = useState<Booking>({
    id: 0,
    check_in: '',
    check_out: '',
    guests: 1,
    status: 'Pending',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getBooking(String(id));
      if (response.success && response.data) {
        setFormData(response.data as unknown as Booking);
      } else {
        setError(response.message || 'Failed to fetch booking');
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'An error occurred while fetching booking';
      console.error('Fetch booking error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setErrors({});
    setIsSubmitting(true);

    try {
      const submitData = {
        check_in: formData.check_in,
        check_out: formData.check_out,
        guests: parseInt(String(formData.guests)) || 1,
        status: formData.status,
        notes: formData.notes || '',
      };

      console.log('Submitting booking update:', submitData);
      const response = await apiService.updateBooking(String(id), submitData);

      console.log('Update response:', response);
      if (response.success) {
        navigate('/bookings');
      } else {
        setError(response.message || 'Failed to update booking');
        if (response.errors) {
          setErrors(response.errors);
        }
      }
    } catch (err: any) {
      console.error('Update error:', err);
      if (err?.errors) {
        setErrors(err.errors);
        setError('Please fix the errors below');
      } else {
        const errorMessage = err?.message || err?.error || 'An error occurred while updating booking';
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl">Edit Booking #{id}</h1>
          <p className="text-gray-600">Update booking details</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-600">Loading booking details...</p>
        </div>
      )}

      {!isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Details */}
            <div>
              <h3 className="text-lg mb-4 border-b pb-2">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Check-in Date"
                    type="date"
                    value={formData.check_in}
                    onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                    required
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  {errors.check_out && <p className="text-red-600 text-sm mt-1">{errors.check_out[0]}</p>}
                </div>
                <div>
                  <FormInput
                    label="Number of Guests"
                    type="number"
                    value={String(formData.guests)}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.guests && <p className="text-red-600 text-sm mt-1">{errors.guests[0]}</p>}
                </div>
                <div>
                  <FormInput
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status[0]}</p>}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg mb-4 border-b pb-2">Additional Information</h3>
              <div>
                <FormInput
                  label="Notes"
                  textarea
                  rows={4}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes[0]}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => navigate('/bookings')}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Booking'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
