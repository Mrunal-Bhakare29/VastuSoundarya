const Project = require('../models/Project');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const assertValidCategory = async (categoryName) => {
  if (!categoryName) return;
  const category = await Category.findOne({ name: categoryName, isActive: true });
  if (!category) {
    const err = new Error('Invalid or inactive category');
    err.statusCode = 400;
    throw err;
  }
};

// @desc    Get all projects (public)
// @route   GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.status) filter.status = req.query.status;

  const projects = await Project.find(filter).sort({ createdAt: -1 });
  res.json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json(project);
});

// @desc    Create project
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  await assertValidCategory(req.body.category);

  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, 'vastusoundarya/projects');
      images.push({ url: result.secure_url, publicId: result.public_id });
    }
  }

  const project = await Project.create({
    ...req.body,
    featured: req.body.featured === 'true' || req.body.featured === true,
    images,
  });

  res.status(201).json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (req.body.category) {
    await assertValidCategory(req.body.category);
  }

  const updates = { ...req.body };
  if (updates.featured !== undefined) {
    updates.featured = updates.featured === 'true' || updates.featured === true;
  }

  if (req.files && req.files.length > 0) {
    const newImages = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, 'vastusoundarya/projects');
      newImages.push({ url: result.secure_url, publicId: result.public_id });
    }
    updates.images = [...project.images, ...newImages];
  }

  const updated = await Project.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  for (const img of project.images) {
    if (img.publicId) {
      await deleteFromCloudinary(img.publicId);
    }
  }

  await project.deleteOne();
  res.json({ message: 'Project removed' });
});

// @desc    Delete a single project image
// @route   DELETE /api/projects/:id/images?publicId=
const deleteProjectImage = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const publicId = req.query.publicId;
  if (!publicId) {
    res.status(400);
    throw new Error('publicId query parameter is required');
  }

  const exists = project.images.some((img) => img.publicId === publicId);
  if (!exists) {
    res.status(404);
    throw new Error('Image not found on this project');
  }

  await deleteFromCloudinary(publicId);
  project.images = project.images.filter((img) => img.publicId !== publicId);
  await project.save();

  res.json(project);
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
};
