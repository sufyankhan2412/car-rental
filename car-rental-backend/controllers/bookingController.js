import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, pickupLocation, deliveryOption, extras } = req.body;

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (!car.available) {
      return res.status(400).json({ message: 'Car is not available' });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      car: carId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Car is already booked for these dates' });
    }

    // Calculate total price
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const basePrice = car.pricePerDay * days;
    const deliveryFee = deliveryOption ? 50 : 0;
    const serviceFee = basePrice * 0.1;
    const totalPrice = basePrice + deliveryFee + serviceFee;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      pickupLocation,
      deliveryOption,
      totalPrice,
      extras: extras || {},
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('car')
      .populate('user', 'name email phone');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User cancelled';
    booking.cancelledAt = Date.now();

    await booking.save();

    // Make car available again
    if (booking.car) {
      await Car.findByIdAndUpdate(booking.car._id, { available: true });
      console.log(`🚗 Car ${booking.car.name} is now available again`);
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate booking price
// @route   POST /api/bookings/calculate-price
// @access  Public
export const calculatePrice = async (req, res) => {
  try {
    const { carId, startDate, endDate, extras } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const basePrice = car.pricePerDay * days;
    const deliveryFee = extras?.delivery ? 50 : 0;
    const insuranceFee = extras?.insurance ? days * 15 : 0;
    const gpsFee = extras?.gps ? days * 10 : 0;
    const serviceFee = basePrice * 0.1;
    const totalPrice = basePrice + deliveryFee + insuranceFee + gpsFee + serviceFee;

    res.json({
      days,
      basePrice,
      deliveryFee,
      insuranceFee,
      gpsFee,
      serviceFee,
      totalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('car')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
