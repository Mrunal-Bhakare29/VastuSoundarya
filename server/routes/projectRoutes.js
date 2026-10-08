const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const projectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

const projectUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('status')
    .optional()
    .isIn(['Ongoing', 'Completed', 'Upcoming'])
    .withMessage('Invalid status'),
];

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post(
  '/',
  protect,
  admin,
  upload.array('images', 10),
  validate(projectValidation),
  createProject
);
router.put(
  '/:id',
  protect,
  admin,
  upload.array('images', 10),
  validate(projectUpdateValidation),
  updateProject
);
router.delete('/:id', protect, admin, deleteProject);
router.delete('/:id/images', protect, admin, deleteProjectImage);

module.exports = router;
