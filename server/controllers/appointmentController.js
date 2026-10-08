const Appointment = require('../models/Appointment');
const asyncHandler = require('../utils/asyncHandler');
const { sendAppointmentNotification } = require('../utils/emailService');

// @desc    Create appointment
// @route   POST /api/appointments
const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create(req.body);

  try {
    await sendAppointmentNotification(appointment);
  } catch (error) {
    console.error('Email notification failed:', error.message);
  }

  res.status(201).json(appointment);
});

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
const getAppointments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
  res.json(appointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (req.body.status) {
    appointment.status = req.body.status;
  }
  await appointment.save();

  res.json(appointment);
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  await appointment.deleteOne();
  res.json({ message: 'Appointment removed' });
});

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
