import { useState, useContext } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
  const { } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/users');
  };

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'User', label: 'User' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/users')} className="p-2 hover:bg-gray-100 rounded-lg" title="Back to users" aria-label="Back to users">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">Add New User</h1>
          <p className="text-gray-600">Create a new user account</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <FormInput label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <FormInput label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <FormInput label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <FormInput label="Role" options={roleOptions} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
          
          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/users')} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Create User</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
