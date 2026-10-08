const express = require('express');
const { body } = require('express-validator');
const {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const enquiryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

const statusValidation = [
  body('status')
    .isIn(['New', 'In Progress', 'Resolved'])
    .withMessage('Invalid enquiry status'),
];

router.post('/', validate(enquiryValidation), createEnquiry);
router.get('/', protect, admin, getEnquiries);
router.put('/:id', protect, admin, validate(statusValidation), updateEnquiry);
router.delete('/:id', protect, admin, deleteEnquiry);

module.exports = router;
