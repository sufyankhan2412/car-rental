import api from './api';

// Generate rental contract
export const generateContract = async (bookingId) => {
  const response = await api.post('/contracts/generate', { bookingId });
  return response.data;
};

// Send contract for signature
export const sendForSignature = async (bookingId) => {
  const response = await api.post('/contracts/send-for-signature', { bookingId });
  return response.data;
};

// Get contract status
export const getContractStatus = async (bookingId) => {
  const response = await api.get(`/contracts/${bookingId}/status`);
  return response.data;
};

// Sign contract (development mode)
export const signContract = async (bookingId, signature) => {
  const response = await api.post('/contracts/sign', { bookingId, signature });
  return response.data;
};

// Download signed contract
export const downloadContract = async (bookingId) => {
  const response = await api.get(`/contracts/${bookingId}/download`);
  return response.data;
};

export default {
  generateContract,
  sendForSignature,
  getContractStatus,
  signContract,
  downloadContract,
};
