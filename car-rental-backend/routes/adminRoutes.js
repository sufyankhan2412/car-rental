import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
  getRevenueAnalytics,
  getAllPayments,
  refundPayment,
  getCustomerDetails,
  updateVerificationStatus,
  getPendingVerifications,
  getSystemSettings,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Booking management
router.get('/bookings', getAllBookingsAdmin);
router.put('/bookings/:id/status', updateBookingStatusAdmin);

// Analytics
router.get('/analytics/revenue', getRevenueAnalytics);

// Payment management
router.get('/payments', getAllPayments);
router.post('/payments/:bookingId/refund', refundPayment);

// Customer management
router.get('/customers/:id', getCustomerDetails);
router.put('/customers/:id/verification', updateVerificationStatus);

// Verification reviews
router.get('/verifications/pending', getPendingVerifications);

// System settings
router.get('/settings', getSystemSettings);

export default router;
