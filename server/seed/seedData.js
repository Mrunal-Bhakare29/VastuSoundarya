require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Category = require('../models/Category');

const categories = [
  { name: 'Residential', slug: 'residential', description: 'Homes and villas' },
  { name: 'Commercial', slug: 'commercial', description: 'Offices and retail' },
  { name: 'Interior', slug: 'interior', description: 'Interior design projects' },
];

const services = [
  {
    title: 'Architectural Planning',
    slug: 'architectural-planning',
    shortDescription: 'Comprehensive planning for functional and aesthetic spaces.',
    description:
      'Our architectural planning service covers site analysis, space planning, zoning compliance, and conceptual design development. We create well-organized layouts that balance aesthetics, functionality, and Vastu harmony.',
    icon: 'blueprint',
    order: 1,
  },
  {
    title: '2D Designing',
    slug: '2d-designing',
    shortDescription: 'Precise floor plans and technical drawings.',
    description:
      'Detailed 2D designs including floor plans, elevations, and working drawings that serve as the foundation for construction and approvals.',
    icon: 'layout',
    order: 2,
  },
  {
    title: '3D Designing',
    slug: '3d-designing',
    shortDescription: 'Photorealistic visualizations of your dream space.',
    description:
      'Experience your project before it is built with stunning 3D renders, walkthroughs, and virtual presentations that bring designs to life.',
    icon: 'cube',
    order: 3,
  },
  {
    title: 'Estimation',
    slug: 'estimation',
    shortDescription: 'Accurate cost planning and budgeting.',
    description:
      'Transparent project estimation with detailed BOQ, material specifications, and phased cost breakdowns for informed decision-making.',
    icon: 'calculator',
    order: 4,
  },
  {
    title: 'Submission Drawings',
    slug: 'submission-drawings',
    shortDescription: 'Authority-compliant documentation for approvals.',
    description:
      'Complete submission drawing sets prepared per local building bylaws and municipal requirements for smooth approval processes.',
    icon: 'document',
    order: 5,
  },
  {
    title: 'Structural Drawings',
    slug: 'structural-drawings',
    shortDescription: 'Safe and efficient structural engineering solutions.',
    description:
      'Engineered structural drawings ensuring safety, durability, and compliance with IS codes for residential and commercial projects.',
    icon: 'structure',
    order: 6,
  },
  {
    title: 'Interior Design',
    slug: 'interior-design',
    shortDescription: 'Luxury interiors tailored to your lifestyle.',
    description:
      'End-to-end interior design from concept to execution — furniture, lighting, materials, and bespoke elements that reflect your personality.',
    icon: 'sofa',
    order: 7,
  },
  {
    title: 'Vastu Consultation',
    slug: 'vastu-consultation',
    shortDescription: 'Harmonize your space with ancient Vastu wisdom.',
    description:
      'Expert Vastu analysis and remedies for homes and offices — optimizing energy flow, prosperity, and well-being through spatial alignment.',
    icon: 'compass',
    order: 8,
  },
  {
    title: 'Professional Consultancy',
    slug: 'professional-consultancy',
    shortDescription: 'Expert guidance for every stage of your project.',
    description:
      'One-on-one consultancy for design decisions, contractor coordination, material selection, and project management support.',
    icon: 'consult',
    order: 9,
  },
];

const projects = [
  {
    name: 'Serene Villa Residence',
    category: 'Residential',
    location: 'Pune, Maharashtra',
    description:
      'A luxurious 4BHK villa blending contemporary architecture with Vastu principles. Features open-plan living, natural light optimization, and a serene courtyard garden.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        publicId: 'seed/residential-1',
      },
    ],
    status: 'Completed',
    completionInfo: 'Completed March 2025',
    featured: true,
  },
  {
    name: 'Harmony Heights Apartment',
    category: 'Residential',
    location: 'Mumbai, Maharashtra',
    description:
      'Premium apartment interior with warm tones, custom furniture, and Vastu-aligned room placements for a family of four.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
        publicId: 'seed/residential-2',
      },
    ],
    status: 'Completed',
    completionInfo: 'Completed January 2025',
    featured: true,
  },
  {
    name: 'Zen Corporate Office',
    category: 'Commercial',
    location: 'Bangalore, Karnataka',
    description:
      'Modern corporate workspace designed for productivity and employee wellness, featuring collaborative zones and Vastu-compliant executive cabins.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        publicId: 'seed/commercial-1',
      },
    ],
    status: 'Completed',
    completionInfo: 'Completed November 2024',
    featured: true,
  },
  {
    name: 'Artisan Retail Boutique',
    category: 'Commercial',
    location: 'Jaipur, Rajasthan',
    description:
      'Boutique retail space combining traditional Rajasthani aesthetics with modern display systems and optimal customer flow.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        publicId: 'seed/commercial-2',
      },
    ],
    status: 'Ongoing',
    completionInfo: 'Expected June 2026',
    featured: false,
  },
  {
    name: 'Minimalist Living Room',
    category: 'Interior',
    location: 'Delhi NCR',
    description:
      'Elegant minimalist interior with neutral palette, statement lighting, and custom-built storage solutions.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221197210-dd6b41faaea6?w=800',
        publicId: 'seed/interior-1',
      },
    ],
    status: 'Completed',
    completionInfo: 'Completed August 2025',
    featured: true,
  },
  {
    name: 'Luxury Master Suite',
    category: 'Interior',
    location: 'Hyderabad, Telangana',
    description:
      'Opulent master bedroom suite with walk-in wardrobe, ensuite bathroom, and Vastu-aligned bed placement.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616594039914-902ff1ca1e0f?w=800',
        publicId: 'seed/interior-2',
      },
    ],
    status: 'Completed',
    completionInfo: 'Completed May 2025',
    featured: false,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@vastusoundarya.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log(`${categories.length} categories seeded`);

    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log(`${services.length} services seeded`);

    await Project.deleteMany({});
    await Project.insertMany(projects);
    console.log(`${projects.length} projects seeded`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
