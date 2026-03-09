import { motion } from 'framer-motion';
import { Star, MapPin, Users, Fuel, Settings, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CarCard = ({ car, index = 0 }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group card-premium overflow-hidden hover-glow"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <motion.img
          src={car.image || 'https://via.placeholder.com/400x300?text=Car'}
          alt={car.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {car.featured && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1"
            >
              <Zap className="h-3 w-3" />
              <span>Featured</span>
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`ml-auto p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Quick View on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Link
            to={`/cars/${car._id}`}
            className="block w-full bg-white/95 backdrop-blur-sm text-center py-2.5 rounded-xl font-semibold text-secondary hover:bg-white transition-all duration-300 shadow-lg"
          >
            Quick View
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-secondary mb-1.5 group-hover:text-primary transition-colors duration-300">
              {car.name}
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
              <span>{car.location}</span>
            </div>
          </div>
          <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-bold text-gray-900">{car.rating || 4.5}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-gray-600 font-medium">{car.seats} seats</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Settings className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-gray-600 font-medium">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Fuel className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-gray-600 font-medium">{car.fuelType}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-black text-gray-900">
                ${car.pricePerDay}
              </span>
              <span className="text-gray-600 text-base ml-1 font-semibold">/day</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Best price guaranteed</span>
          </div>
          <Link
            to={`/cars/${car._id}`}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
