const Project = require('../models/Project');
const Appointment = require('../models/Appointment');
const Enquiry = require('../models/Enquiry');
const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProjects, totalAppointments, pendingAppointments, totalEnquiries, totalServices] =
    await Promise.all([
      Project.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Enquiry.countDocuments(),
      Service.countDocuments({ isActive: true }),
    ]);

  const recentAppointments = await Appointment.find().sort({ createdAt: -1 }).limit(5);
  const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    totalProjects,
    totalAppointments,
    pendingAppointments,
    totalEnquiries,
    totalServices,
    recentAppointments,
    recentEnquiries,
  });
});

module.exports = { getDashboardStats };
