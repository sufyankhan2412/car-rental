import api from './api';

export const paymentService = {
  // Create Stripe checkout session
  createCheckoutSession: async (bookingId) => {
    const response = await api.post('/payments/create-checkout', { bookingId });
    return response.data;
  },

  // Create payment intent
  createPaymentIntent: async (bookingId) => {
    const response = await api.post('/payments/create-intent', { bookingId });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId) => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (sessionId) => {
    const response = await api.get(`/payments/status/${sessionId}`);
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (paymentMethodData) => {
    const response = await api.post('/payments/methods', paymentMethodData);
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (id) => {
    const response = await api.delete(`/payments/methods/${id}`);
    return response.data;
  },

  // Mark payment as complete (for local testing without webhooks)
  markPaymentComplete: async (bookingId) => {
    const response = await api.post(`/payments/mark-paid/${bookingId}`);
    return response.data;
  },
};
