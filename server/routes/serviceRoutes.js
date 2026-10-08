const express = require('express');
const { body } = require('express-validator');
const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const serviceValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

const serviceUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
];

router.get('/', optionalAuth, getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', protect, admin, upload.single('image'), validate(serviceValidation), createService);
router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  validate(serviceUpdateValidation),
  updateService
);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;
