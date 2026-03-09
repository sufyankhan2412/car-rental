import api from './api';

export const carService = {
  // Get all cars with filters
  getCars: async (filters = {}) => {
    const response = await api.get('/cars', { params: filters });
    return response.data;
  },

  // Get single car by ID
  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  // Get featured cars
  getFeaturedCars: async () => {
    const response = await api.get('/cars/featured');
    return response.data;
  },

  // Search cars
  searchCars: async (searchParams) => {
    const response = await api.post('/cars/search', searchParams);
    return response.data;
  },

  // Get car availability
  getCarAvailability: async (carId, startDate, endDate) => {
    const response = await api.get(`/cars/${carId}/availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Admin: Create car
  createCar: async (carData) => {
    const response = await api.post('/cars', carData);
    return response.data;
  },

  // Admin: Update car
  updateCar: async (id, carData) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },

  // Admin: Delete car
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },
};
