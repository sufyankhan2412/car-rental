import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // User authentication
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Booking state
      bookingDates: {
        startDate: null,
        endDate: null,
      },
      setBookingDates: (dates) => set({ bookingDates: dates }),

      // Selected car
      selectedCar: null,
      setSelectedCar: (car) => set({ selectedCar: car }),

      // Search filters
      searchFilters: {
        location: '',
        priceRange: [0, 500],
        vehicleType: [],
        seats: null,
        transmission: null,
      },
      setSearchFilters: (filters) => set({ searchFilters: filters }),

      // Cart/Booking
      currentBooking: null,
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      clearBooking: () => set({ 
        currentBooking: null, 
        selectedCar: null,
        bookingDates: { startDate: null, endDate: null }
      }),
    }),
    {
      name: 'car-rental-storage',
    }
  )
);

export default useStore;
