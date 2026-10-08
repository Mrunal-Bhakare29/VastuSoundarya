import { useEffect, useState } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const emptyForm = {
  title: '',
  description: '',
  shortDescription: '',
  icon: 'building',
  order: 0,
  isActive: true,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = () => {
    getServices({ all: 'true' })
      .then((res) => setServices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setImage(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (service) => {
    setForm({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription || '',
      icon: service.icon || 'building',
      order: service.order || 0,
      isActive: service.isActive,
    });
    setImage(null);
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);

    try {
      if (editingId) {
        await updateService(editingId, formData);
        setAlert({ type: 'success', message: 'Service updated' });
      } else {
        await createService(formData);
        setAlert({ type: 'success', message: 'Service created' });
      }
      setShowForm(false);
      fetchServices();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      setAlert({ type: 'success', message: 'Service deleted' });
      fetchServices();
    } catch {
      setAlert({ type: 'error', message: 'Delete failed' });
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-charcoal-200 rounded-sm text-sm focus:outline-none focus:border-gold-600';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-2xl">Services</h1>
        <button type="button" onClick={openCreate} className="btn-primary text-xs py-2">Add Service</button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {showForm && (
        <div className="bg-white p-6 rounded-sm border border-charcoal-100 mb-8">
          <h2 className="font-medium mb-4">{editingId ? 'Edit Service' : 'New Service'}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} />
            <input placeholder="Icon key" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass} />
            <input placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} />
            <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) })} className={inputClass} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={`${inputClass} sm:col-span-2`} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>
            <div>
              <label className="block text-sm mb-2">Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary text-xs py-2 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-charcoal-200 rounded-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <div className="bg-white rounded-sm border border-charcoal-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Active</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {services.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-3">{s.title}</td>
                  <td className="px-4 py-3">{s.order}</td>
                  <td className="px-4 py-3">{s.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" onClick={() => openEdit(s)} className="text-gold-600">Edit</button>
                    <button type="button" onClick={() => handleDelete(s._id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
