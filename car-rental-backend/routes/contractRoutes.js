import express from 'express';
import {
  generateContract,
  sendForSignature,
  getContractStatus,
  handleContractWebhook,
  signContract,
  downloadContract,
} from '../controllers/contractController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/generate', protect, generateContract);
router.post('/send-for-signature', protect, sendForSignature);
router.get('/:bookingId/status', protect, getContractStatus);
router.post('/sign', protect, signContract);
router.get('/:bookingId/download', protect, downloadContract);

// Public webhook route (verified by DocuSign signature)
router.post('/webhook', handleContractWebhook);

export default router;
