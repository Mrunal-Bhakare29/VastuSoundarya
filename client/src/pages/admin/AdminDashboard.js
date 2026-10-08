import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';

const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-sm border border-charcoal-100">
    <p className="text-charcoal-500 text-sm uppercase tracking-wider">{label}</p>
    <p className={`font-display text-3xl mt-2 ${color}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!stats) return <p className="text-charcoal-500">Failed to load dashboard.</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal-900 mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Projects" value={stats.totalProjects} color="text-gold-600" />
        <StatCard label="Total Appointments" value={stats.totalAppointments} color="text-blue-600" />
        <StatCard label="Pending Appointments" value={stats.pendingAppointments} color="text-amber-600" />
        <StatCard label="Total Enquiries" value={stats.totalEnquiries} color="text-green-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-sm border border-charcoal-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100">
            <h2 className="font-medium">Recent Appointments</h2>
          </div>
          <div className="divide-y divide-charcoal-100">
            {stats.recentAppointments?.length === 0 ? (
              <p className="p-6 text-charcoal-500 text-sm">No appointments yet.</p>
            ) : (
              stats.recentAppointments?.map((apt) => (
                <div key={apt._id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{apt.name}</p>
                    <p className="text-charcoal-500 text-xs">{apt.projectType}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-charcoal-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100">
            <h2 className="font-medium">Recent Enquiries</h2>
          </div>
          <div className="divide-y divide-charcoal-100">
            {stats.recentEnquiries?.length === 0 ? (
              <p className="p-6 text-charcoal-500 text-sm">No enquiries yet.</p>
            ) : (
              stats.recentEnquiries?.map((enq) => (
                <div key={enq._id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{enq.name}</p>
                    <p className="text-charcoal-500 text-xs truncate max-w-[200px]">{enq.subject}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    enq.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {enq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
