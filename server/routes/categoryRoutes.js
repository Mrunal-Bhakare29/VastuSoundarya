const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
];

router.get('/', optionalAuth, getCategories);
router.post('/', protect, admin, validate(categoryValidation), createCategory);
router.put('/:id', protect, admin, validate(categoryValidation), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
