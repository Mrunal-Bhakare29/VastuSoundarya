const Category = require('../models/Category');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc    Get categories (public: active only; admin with ?all=true: all)
// @route   GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  // Only authenticated admins can request inactive categories
  const wantsAll = req.query.all === 'true';
  const isAdmin = req.user && req.user.role === 'admin';
  const filter = wantsAll && isAdmin ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ name: 1 });
  res.json(categories);
});

// @desc    Create category
// @route   POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
  const exists = await Category.findOne({ $or: [{ name }, { slug }] });
  if (exists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    slug,
    description: req.body.description || '',
    isActive: req.body.isActive !== false && req.body.isActive !== 'false',
  });

  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const oldName = category.name;
  const name = req.body.name?.trim();

  if (name && name !== category.name) {
    const exists = await Category.findOne({ name, _id: { $ne: category._id } });
    if (exists) {
      res.status(400);
      throw new Error('Category name already in use');
    }
    category.name = name;
    category.slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
  }

  if (req.body.description !== undefined) {
    category.description = req.body.description;
  }
  if (req.body.isActive !== undefined) {
    category.isActive = req.body.isActive === true || req.body.isActive === 'true';
  }

  await category.save();

  // Keep project category labels in sync when renamed
  if (name && name !== oldName) {
    await Project.updateMany({ category: oldName }, { category: name });
  }

  res.json(category);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const inUse = await Project.countDocuments({ category: category.name });
  if (inUse > 0) {
    res.status(400);
    throw new Error(`Cannot delete: ${inUse} project(s) use this category`);
  }

  await category.deleteOne();
  res.json({ message: 'Category removed' });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
