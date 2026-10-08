import { useEffect, useState } from 'react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const statusOptions = ['New', 'In Progress', 'Resolved'];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchEnquiries = () => {
    getEnquiries()
      .then((res) => setEnquiries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiry(id, { status });
      setAlert({ type: 'success', message: status === 'Resolved' ? 'Enquiry resolved' : 'Status updated' });
      fetchEnquiries();
    } catch {
      setAlert({ type: 'error', message: 'Update failed' });
    }
  };

  const handleResolve = (id) => handleStatusChange(id, 'Resolved');

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await deleteEnquiry(id);
      setAlert({ type: 'success', message: 'Enquiry deleted' });
      fetchEnquiries();
    } catch {
      setAlert({ type: 'error', message: 'Delete failed' });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Enquiries</h1>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : enquiries.length === 0 ? (
        <p className="text-charcoal-500">No enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div key={enq._id} className="bg-white p-6 rounded-sm border border-charcoal-100">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <div>
                  <h3 className="font-medium">{enq.name}</h3>
                  <p className="text-sm text-charcoal-500">{enq.email} &bull; {enq.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                    className="text-xs border border-charcoal-200 rounded px-2 py-1"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {enq.status !== 'Resolved' && (
                    <button type="button" onClick={() => handleResolve(enq._id)} className="text-green-600 text-xs">
                      Resolve
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(enq._id)} className="text-red-500 text-xs">Delete</button>
                </div>
              </div>
              <p className="font-medium text-sm mb-1">{enq.subject}</p>
              <p className="text-charcoal-600 text-sm">{enq.message}</p>
              <p className="text-charcoal-400 text-xs mt-2">
                {new Date(enq.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
