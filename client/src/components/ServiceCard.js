const ServiceCard = ({ service }) => {
  const icons = {
    blueprint: '📐',
    layout: '📋',
    cube: '🎨',
    calculator: '📊',
    document: '📄',
    structure: '🏗️',
    sofa: '🛋️',
    compass: '🧭',
    consult: '💼',
    building: '🏛️',
  };

  return (
    <div className="bg-white border border-charcoal-100 p-8 card-hover group">
      <div className="text-4xl mb-4">{icons[service.icon] || icons.building}</div>
      <h3 className="font-display text-xl text-charcoal-900 mb-3 group-hover:text-gold-600 transition-colors">
        {service.title}
      </h3>
      <p className="text-charcoal-500 leading-relaxed">
        {service.shortDescription || service.description?.slice(0, 120) + '...'}
      </p>
    </div>
  );
};

export default ServiceCard;
