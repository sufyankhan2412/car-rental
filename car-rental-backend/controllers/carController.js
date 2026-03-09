import Car from '../models/Car.js';

// @desc    Get all cars with filters
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    const {
      priceRange,
      vehicleType,
      seats,
      transmission,
      location,
      sortBy,
      page = 1,
      limit = 100,
    } = req.query;

    console.log('Received filters:', req.query);

    // Build query
    let query = { available: true };

    // Price range filter
    if (priceRange) {
      let min, max;
      if (Array.isArray(priceRange)) {
        [min, max] = priceRange;
      } else if (typeof priceRange === 'string') {
        [min, max] = priceRange.split(',').map(Number);
      }
      if (min !== undefined && max !== undefined) {
        query.pricePerDay = { $gte: Number(min), $lte: Number(max) };
      }
    }

    // Vehicle type filter
    if (vehicleType && vehicleType.length > 0) {
      const types = Array.isArray(vehicleType) ? vehicleType : [vehicleType];
      if (types.length > 0) {
        query.vehicleType = { $in: types };
      }
    }

    // Seats filter
    if (seats) {
      query.seats = { $gte: parseInt(seats) };
    }

    // Transmission filter
    if (transmission) {
      query.transmission = transmission;
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    console.log('MongoDB query:', JSON.stringify(query));

    // Sort
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort = { pricePerDay: 1 };
        break;
      case 'price-high':
        sort = { pricePerDay: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { featured: -1, rating: -1 };
    }

    const cars = await Car.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('owner', 'name email');

    const count = await Car.countDocuments(query);

    console.log(`Found ${cars.length} cars`);

    res.json({
      cars,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error('Error in getCars:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'name email phone');

    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured cars
// @route   GET /api/cars/featured
// @access  Public
export const getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ featured: true, available: true })
      .sort({ rating: -1 })
      .limit(6);

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res) => {
  try {
    const car = await Car.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      Object.assign(car, req.body);
      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.deleteOne();
      res.json({ message: 'Car removed' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check car availability
// @route   GET /api/cars/:id/availability
// @access  Public
export const checkAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check for overlapping bookings
    const Booking = (await import('../models/Booking.js')).default;
    const overlappingBookings = await Booking.find({
      car: req.params.id,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    res.json({
      available: overlappingBookings.length === 0,
      conflictingBookings: overlappingBookings.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
