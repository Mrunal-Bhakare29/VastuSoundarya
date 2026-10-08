const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc    Get all services
// @route   GET /api/services
const getServices = asyncHandler(async (req, res) => {
  const wantsAll = req.query.all === 'true';
  const isAdmin = req.user && req.user.role === 'admin';
  const filter = wantsAll && isAdmin ? {} : { isActive: true };
  const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(services);
});

// @desc    Get service by slug
// @route   GET /api/services/:slug
const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json(service);
});

// @desc    Create service
// @route   POST /api/services
const createService = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.slug = data.slug || slugify(data.title);
  data.isActive = data.isActive === 'true' || data.isActive === true || data.isActive === undefined;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'vastusoundarya/services');
    data.image = { url: result.secure_url, publicId: result.public_id };
  }

  const service = await Service.create(data);
  res.status(201).json(service);
});

// @desc    Update service
// @route   PUT /api/services/:id
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const updates = { ...req.body };
  if (updates.title && !updates.slug) {
    updates.slug = slugify(updates.title);
  }
  if (updates.isActive !== undefined) {
    updates.isActive = updates.isActive === 'true' || updates.isActive === true;
  }

  if (req.file) {
    if (service.image?.publicId) {
      await deleteFromCloudinary(service.image.publicId);
    }
    const result = await uploadToCloudinary(req.file.buffer, 'vastusoundarya/services');
    updates.image = { url: result.secure_url, publicId: result.public_id };
  }

  const updated = await Service.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Delete service
// @route   DELETE /api/services/:id
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  if (service.image?.publicId) {
    await deleteFromCloudinary(service.image.publicId);
  }

  await service.deleteOne();
  res.json({ message: 'Service removed' });
});

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
};
