import express from 'express';
import {
  createVerificationSession,
  handleVerificationWebhook,
  getVerificationStatus,
  uploadVerificationDocument,
  getPendingVerifications,
  updateVerificationStatus,
} from '../controllers/verificationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Webhook route (must use raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleVerificationWebhook);

// User routes
router.post('/create-session', protect, createVerificationSession);
router.get('/status', protect, getVerificationStatus);
router.post('/upload-document', protect, uploadVerificationDocument);

// Admin routes
router.get('/pending', protect, admin, getPendingVerifications);
router.put('/:userId/status', protect, admin, updateVerificationStatus);

export default router;
