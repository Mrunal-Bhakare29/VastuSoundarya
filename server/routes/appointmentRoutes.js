const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const appointmentValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('projectType').notEmpty().withMessage('Project type is required'),
  body('preferredDate').isISO8601().withMessage('Valid date is required'),
  body('preferredTime').trim().notEmpty().withMessage('Preferred time is required'),
];

const statusValidation = [
  body('status')
    .isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled'])
    .withMessage('Invalid appointment status'),
];

router.post('/', validate(appointmentValidation), createAppointment);
router.get('/', protect, admin, getAppointments);
router.put('/:id', protect, admin, validate(statusValidation), updateAppointment);
router.delete('/:id', protect, admin, deleteAppointment);

module.exports = router;
