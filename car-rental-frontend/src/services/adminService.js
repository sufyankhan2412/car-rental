import api from './api';

// Get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// User management
export const getAllUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Booking management
export const getAllBookingsAdmin = async (params = {}) => {
  const response = await api.get('/admin/bookings', { params });
  return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.put(`/admin/bookings/${bookingId}/status`, { status });
  return response.data;
};

// Analytics
export const getRevenueAnalytics = async (params = {}) => {
  const response = await api.get('/admin/analytics/revenue', { params });
  return response.data;
};

// Payment management
export const getAllPayments = async (params = {}) => {
  const response = await api.get('/admin/payments', { params });
  return response.data;
};

export const refundPayment = async (bookingId) => {
  const response = await api.post(`/admin/payments/${bookingId}/refund`);
  return response.data;
};

// Customer management
export const getCustomerDetails = async (customerId) => {
  const response = await api.get(`/admin/customers/${customerId}`);
  return response.data;
};

export const updateVerificationStatus = async (customerId, data) => {
  const response = await api.put(`/admin/customers/${customerId}/verification`, data);
  return response.data;
};

// Verification reviews
export const getPendingVerifications = async () => {
  const response = await api.get('/admin/verifications/pending');
  return response.data;
};

// System settings
export const getSystemSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllBookingsAdmin,
  updateBookingStatus,
  getRevenueAnalytics,
  getAllPayments,
  refundPayment,
  getCustomerDetails,
  updateVerificationStatus,
  getPendingVerifications,
  getSystemSettings,
};
