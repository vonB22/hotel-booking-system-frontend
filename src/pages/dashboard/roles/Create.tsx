import { useState, useContext } from 'react';
import { NavigationContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../Components/FormInput';
import Button from '../../../Components/Button';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
  const {} = useContext(NavigationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/roles');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/roles')} className="p-2 hover:bg-gray-100 rounded-lg" title="Go back"><ArrowLeft className="w-5 h-5" /></button>
        <div><h1 className="text-3xl">Create New Role</h1><p className="text-gray-600">Define a new role with permissions</p></div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Role Information</h3>
            <div className="space-y-4">
              <FormInput label="Role Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <FormInput label="Description" textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-4 border-b pb-2">Permissions</h3>
            <div className="space-y-4">
              {['Bookings', 'Hotels', 'Users'].map((module) => (
                <div key={module}>
                  <h4 className="mb-2">{module}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['view', 'create', 'edit', 'delete'].map((action) => (
                      <label key={action} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm capitalize">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/roles')} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Create Role</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
