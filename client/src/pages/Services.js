import { useEffect, useState } from 'react';
import { getServices } from '../services/apiService';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="relative py-32 bg-charcoal-900">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920"
            alt="Services"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Our Services</h1>
          <p className="text-charcoal-300 text-lg max-w-2xl mx-auto">
            Comprehensive design and consultancy solutions tailored to your needs
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingSpinner className="py-20" />
          ) : services.length === 0 ? (
            <p className="text-center text-charcoal-500">No services available at the moment.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service._id}>
                  <ServiceCard service={service} />
                  <p className="mt-4 text-charcoal-600 text-sm leading-relaxed px-2">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Services;
