import express from 'express';
import {
  getCars,
  getCarById,
  getFeaturedCars,
  createCar,
  updateCar,
  deleteCar,
  checkAvailability,
} from '../controllers/carController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(protect, admin, createCar);

router.get('/featured', getFeaturedCars);

router.route('/:id')
  .get(getCarById)
  .put(protect, admin, updateCar)
  .delete(protect, admin, deleteCar);

router.get('/:id/availability', checkAvailability);

export default router;
