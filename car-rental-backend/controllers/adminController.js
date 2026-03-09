import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Total bookings
    const totalBookings = await Booking.countDocuments();
    
    // Active rentals (confirmed or active status)
    const activeRentals = await Booking.countDocuments({
      status: { $in: ['confirmed', 'active'] },
    });
    
    // Available cars
    const availableCars = await Car.countDocuments({ available: true });
    
    // Total cars
    const totalCars = await Car.countDocuments();
    
    // Total revenue (paid bookings)
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    
    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('car', 'name brand model')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    
    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const revenueByMonth = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    
    // Total users
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    res.json({
      stats: {
        totalBookings,
        activeRentals,
        availableCars,
        totalCars,
        totalRevenue,
        totalUsers,
        verifiedUsers,
      },
      recentBookings,
      bookingsByStatus,
      revenueByMonth,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookingsAdmin = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = '', 
      paymentStatus = '',
      search = '' 
    } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model image pricePerDay')
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

// @desc    Update booking status (admin)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = { paymentStatus: 'paid' };
    
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    // Daily revenue
    const dailyRevenue = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 30 },
    ]);
    
    // Revenue by car
    const revenueByCar = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$car',
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carDetails',
        },
      },
      { $unwind: '$carDetails' },
    ]);
    
    res.json({
      dailyRevenue,
      revenueByCar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    
    const query = {};
    if (status) {
      query.paymentStatus = status;
    }
    
    const payments = await Booking.find(query)
      .select('user car totalPrice paymentStatus paymentIntentId createdAt startDate endDate')
      .populate('user', 'name email')
      .populate('car', 'name brand model')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Booking.countDocuments(query);
    
    // Calculate totals
    const totals = await Booking.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
    ]);
    
    res.json({
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      totals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refund payment
// @route   POST /api/admin/payments/:bookingId/refund
// @access  Private/Admin
export const refundPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Payment not eligible for refund' });
    }
    
    // Update booking
    booking.paymentStatus = 'refunded';
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ message: 'Payment refunded successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer details
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
export const getCustomerDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Get customer bookings
    const bookings = await Booking.find({ user: req.params.id })
      .populate('car', 'name brand model image')
      .sort({ createdAt: -1 });
    
    // Calculate stats
    const totalSpent = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    
    res.json({
      customer: user,
      bookings,
      stats: {
        totalSpent,
        totalBookings,
        activeBookings,
        completedBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer verification status
// @route   PUT /api/admin/customers/:id/verification
// @access  Private/Admin
export const updateVerificationStatus = async (req, res) => {
  try {
    const { isVerified, verificationNotes } = req.body;
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    user.isVerified = isVerified;
    if (verificationNotes) {
      user.verificationNotes = verificationNotes;
    }
    
    await user.save();
    
    res.json({ message: 'Verification status updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending verifications
// @route   GET /api/admin/verifications/pending
// @access  Private/Admin
export const getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { isVerified: false },
        { verificationStatus: 'pending' },
      ],
    })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSystemSettings = async (req, res) => {
  try {
    // Return current system configuration
    res.json({
      settings: {
        maintenanceMode: false,
        allowNewRegistrations: true,
        requireVerification: true,
        defaultCurrency: 'USD',
        taxRate: 0.1,
        platformFee: 0.15,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
