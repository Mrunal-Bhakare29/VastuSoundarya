const TestimonialCard = ({ name, role, text, image }) => (
  <div className="bg-white p-8 border border-charcoal-100 card-hover">
    <div className="flex items-center gap-1 text-gold-500 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
    <p className="text-charcoal-600 italic leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
    <div className="flex items-center gap-4">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
      />
      <div>
        <p className="font-medium text-charcoal-900">{name}</p>
        <p className="text-sm text-charcoal-500">{role}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
