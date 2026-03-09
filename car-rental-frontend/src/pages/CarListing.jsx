import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CarCard from '../components/CarCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { carService } from '../services/carService';
import useStore from '../store/useStore';

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const { searchFilters, setSearchFilters } = useStore();

  useEffect(() => {
    fetchCars();
  }, [searchFilters, sortBy]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      console.log('Fetching cars with filters:', searchFilters, 'sortBy:', sortBy);
      
      // Prepare params for API call
      const params = {
        sortBy,
        ...searchFilters,
      };
      
      // Convert priceRange array to comma-separated string if needed
      if (searchFilters.priceRange && Array.isArray(searchFilters.priceRange)) {
        params.priceRange = searchFilters.priceRange.join(',');
      }
      
      console.log('API params:', params);
      
      const data = await carService.getCars(params);
      console.log('API response:', data);
      
      // Handle both array and object responses
      const carsArray = Array.isArray(data) ? data : (data.cars || []);
      setCars(carsArray);
      console.log('Set cars:', carsArray.length, 'cars');
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setSearchFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-secondary mb-2">
            Browse Cars
          </h1>
          <p className="text-gray-600">
            Find the perfect vehicle for your journey • {cars.length} cars available
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <FilterSidebar
              filters={searchFilters}
              onFilterChange={handleFilterChange}
            />
          </motion.div>

          {/* Car Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4"
          >
            {/* Sort Options */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <p className="text-gray-900 font-semibold">
                  {loading ? 'Loading...' : `${cars.length} cars available`}
                </p>
                {!loading && cars.length > 0 && (
                  <span className="text-sm text-gray-500">
                    • Updated just now
                  </span>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="popular">🔥 Most Popular</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="newest">✨ Newest First</option>
              </select>
            </motion.div>

            {/* Cars Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <LoadingSkeleton key={i} type="card" />
                ))}
              </div>
            ) : cars.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
              >
                {cars.map((car, index) => (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                  >
                    <CarCard car={car} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-white rounded-2xl shadow-sm"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any cars matching your criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => handleFilterChange({
                      priceRange: [0, 500],
                      vehicleType: [],
                      seats: null,
                      transmission: null,
                    })}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CarListing;
