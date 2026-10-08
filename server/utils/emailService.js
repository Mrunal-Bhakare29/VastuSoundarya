const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('Email not configured. Skipping email send.');
    return { skipped: true };
  }

  const mailOptions = {
    from: `"VastuSoundarya" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  };

  return transporter.sendMail(mailOptions);
};

const sendAppointmentNotification = async (appointment) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;

  const html = `
    <h2>New Appointment Booking</h2>
    <p><strong>Name:</strong> ${appointment.name}</p>
    <p><strong>Email:</strong> ${appointment.email}</p>
    <p><strong>Phone:</strong> ${appointment.phone}</p>
    <p><strong>Project Type:</strong> ${appointment.projectType}</p>
    <p><strong>Preferred Date:</strong> ${new Date(appointment.preferredDate).toLocaleDateString()}</p>
    <p><strong>Preferred Time:</strong> ${appointment.preferredTime}</p>
    <p><strong>Message:</strong> ${appointment.message || 'N/A'}</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Appointment: ${appointment.name}`,
    html,
    text: `New appointment from ${appointment.name} (${appointment.email})`,
  });
};

module.exports = { sendEmail, sendAppointmentNotification };
