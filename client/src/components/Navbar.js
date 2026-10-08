import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/appointment', label: 'Book Appointment' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const adminPath = isAuthenticated ? '/admin' : '/admin/login';
  const adminLabel = isAuthenticated ? 'Dashboard' : 'Admin Login';

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-charcoal-900 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-black/30' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center shrink-0" aria-label="VastuSoundarya home">
            <BrandLogo size="nav" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? 'text-gold-400 font-medium' : 'text-white/80 hover:text-gold-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to={adminPath}
              className="text-xs uppercase tracking-wider px-4 py-2 border border-white/70 text-white hover:bg-white hover:text-charcoal-900 transition-colors duration-200"
            >
              {adminLabel}
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow-lg">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-wider py-2 ${
                      isActive ? 'text-gold-600 font-medium' : 'text-charcoal-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to={adminPath}
                className="text-xs uppercase tracking-wider text-center px-4 py-2 border border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-colors"
              >
                {adminLabel}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
