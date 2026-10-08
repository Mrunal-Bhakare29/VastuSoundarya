import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-white">
      <div className="max-w-7xl mx-auto section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="inline-block mb-4" aria-label="VastuSoundarya home">
              <BrandLogo size="footer" />
            </Link>
            <p className="text-charcoal-300 leading-relaxed">
              Transforming ideas into beautiful, functional, and harmonious spaces through modern
              architecture, luxury interiors, and traditional Vastu principles.
            </p>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wider text-sm mb-4 text-gold-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-charcoal-300">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">Services</Link></li>
              <li><Link to="/projects" className="hover:text-gold-400 transition-colors">Projects</Link></li>
              <li><Link to="/appointment" className="hover:text-gold-400 transition-colors">Book Appointment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wider text-sm mb-4 text-gold-400">
              Contact
            </h4>
            <ul className="space-y-2 text-charcoal-300">
              <li>info@vastusoundarya.com</li>
              <li>+91 98765 43210</li>
              <li>Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-charcoal-700 mt-12 pt-8 text-center text-charcoal-400 text-sm">
          &copy; {new Date().getFullYear()} VastuSoundarya. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
