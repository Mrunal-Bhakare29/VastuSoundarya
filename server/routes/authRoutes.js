const express = require('express');
const { body } = require('express-validator');
const { registerAdmin, loginAdmin, getMe } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', validate(registerValidation), registerAdmin);
router.post('/login', validate(loginValidation), loginAdmin);
router.get('/me', protect, admin, getMe);

module.exports = router;
