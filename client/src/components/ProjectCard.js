import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const imageUrl = project.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';

  return (
    <Link to={`/projects/${project._id}`} className="group block card-hover">
      <div className="relative overflow-hidden aspect-[4/3] bg-charcoal-100">
        <img
          src={imageUrl}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-4 left-4 bg-gold-600 text-white text-xs uppercase tracking-wider px-3 py-1">
          {project.category}
        </span>
      </div>
      <div className="pt-4">
        <h3 className="font-display text-xl text-charcoal-900 group-hover:text-gold-600 transition-colors">
          {project.name}
        </h3>
        <p className="text-charcoal-500 text-sm mt-1">{project.location}</p>
        <span
          className={`inline-block mt-2 text-xs uppercase tracking-wider px-2 py-0.5 rounded ${
            project.status === 'Completed'
              ? 'bg-green-100 text-green-700'
              : project.status === 'Ongoing'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {project.status}
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
