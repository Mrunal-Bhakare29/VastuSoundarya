import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const emptyForm = {
  name: '',
  description: '',
  isActive: true,
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    getCategories({ all: 'true' })
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (category) => {
    setForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setAlert({ type: 'success', message: 'Category updated' });
      } else {
        await createCategory(form);
        setAlert({ type: 'success', message: 'Category created' });
      }
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Projects using it must be reassigned first.')) return;
    try {
      await deleteCategory(id);
      setAlert({ type: 'success', message: 'Category deleted' });
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Delete failed' });
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-charcoal-200 rounded-sm text-sm focus:outline-none focus:border-gold-600';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-2xl">Categories</h1>
        <button type="button" onClick={openCreate} className="btn-primary text-xs py-2">
          Add Category
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {showForm && (
        <div className="bg-white p-6 rounded-sm border border-charcoal-100 mb-8">
          <h2 className="font-medium mb-4">{editingId ? 'Edit Category' : 'New Category'}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary text-xs py-2 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm border border-charcoal-200 rounded-sm"
              >
                Cancel
              </button>
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
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Active</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {categories.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-charcoal-500">{c.slug}</td>
                  <td className="px-4 py-3">{c.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" onClick={() => openEdit(c)} className="text-gold-600">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(c._id)} className="text-red-500">
                      Delete
                    </button>
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

export default AdminCategories;
