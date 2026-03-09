import api from './api';

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Calculate booking price
  calculatePrice: async (carId, startDate, endDate, extras = {}) => {
    const response = await api.post('/bookings/calculate-price', {
      carId,
      startDate,
      endDate,
      extras
    });
    return response.data;
  },

  // Admin: Get all bookings
  getAllBookings: async (filters = {}) => {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },

  // Admin: Update booking status
  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },
};

// Named exports for convenience
export const createBooking = bookingService.createBooking;
export const getUserBookings = bookingService.getUserBookings;
export const getBookingById = bookingService.getBookingById;
export const cancelBooking = bookingService.cancelBooking;
export const calculatePrice = bookingService.calculatePrice;
export const getAllBookings = bookingService.getAllBookings;
export const updateBookingStatus = bookingService.updateBookingStatus;
