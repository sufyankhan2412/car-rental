import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  calculatePrice,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getAllBookings)
  .post(protect, createBooking);

router.get('/my-bookings', protect, getUserBookings);
router.post('/calculate-price', calculatePrice);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, admin, updateBookingStatus);

export default router;
