import express from 'express';
import {
  getPricingRules,
  calculateDeliveryFee,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
} from '../controllers/pricingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPricingRules)
  .post(protect, admin, createPricingRule);

router.post('/calculate-delivery', calculateDeliveryFee);

router.route('/:id')
  .put(protect, admin, updatePricingRule)
  .delete(protect, admin, deletePricingRule);

export default router;
