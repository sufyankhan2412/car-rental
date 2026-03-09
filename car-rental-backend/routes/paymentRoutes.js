import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getPaymentStatus,
  createPaymentIntent,
  confirmPayment,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  markPaymentComplete,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Webhook route (must be before express.json() middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-checkout', protect, createCheckoutSession);
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/status/:sessionId', protect, getPaymentStatus);
router.post('/mark-paid/:bookingId', protect, markPaymentComplete);

router.route('/methods')
  .get(protect, getPaymentMethods)
  .post(protect, addPaymentMethod);

router.delete('/methods/:id', protect, deletePaymentMethod);

export default router;
