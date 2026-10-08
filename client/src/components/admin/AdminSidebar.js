import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/appointments', label: 'Appointments' },
  { to: '/admin/enquiries', label: 'Enquiries' },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-charcoal-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-charcoal-700">
        <h1 className="font-display text-xl">VastuSoundarya</h1>
        <p className="text-charcoal-400 text-xs uppercase tracking-wider mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-sm text-sm transition-colors ${
                isActive
                  ? 'bg-gold-600 text-white'
                  : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-charcoal-700">
        <p className="text-sm text-charcoal-400 mb-2 truncate">{user?.email}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-charcoal-800 rounded-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
