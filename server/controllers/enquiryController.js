const Enquiry = require('../models/Enquiry');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create enquiry
// @route   POST /api/enquiries
const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json(enquiry);
});

// @desc    Get all enquiries (admin)
// @route   GET /api/enquiries
const getEnquiries = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
  res.json(enquiries);
});

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }

  if (req.body.status) {
    enquiry.status = req.body.status;
  }
  await enquiry.save();

  res.json(enquiry);
});

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }

  await enquiry.deleteOne();
  res.json({ message: 'Enquiry removed' });
});

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
};
