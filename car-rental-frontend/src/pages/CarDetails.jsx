import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Fuel, Settings, Shield, Calendar } from 'lucide-react';
import { carService } from '../services/carService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { setSelectedCar, isAuthenticated } = useStore();

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const data = await carService.getCarById(id);
      setCar(data);
      setSelectedImage(0);
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast.error('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a car');
      navigate('/login');
      return;
    }
    setSelectedCar(car);
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton type="list" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Car not found</p>
        </div>
      </div>
    );
  }

  const images = car.images || [car.image || 'https://via.placeholder.com/800x600?text=Car'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative h-96">
                <img
                  src={images[selectedImage]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${car.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Info */}
            <div className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
                    {car.name}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{car.location}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  <span className="ml-2 text-xl font-semibold">{car.rating || 4.5}</span>
                  <span className="ml-1 text-gray-600">({car.reviews || 0} reviews)</span>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Seats</p>
                    <p className="font-semibold">{car.seats}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-semibold">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-semibold">{car.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold">{car.year || 2023}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {car.description || 'This vehicle offers a comfortable and reliable driving experience perfect for your journey.'}
                </p>
              </div>

              {/* Features */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Features</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(car.features || ['Air Conditioning', 'Bluetooth', 'GPS Navigation', 'USB Charging']).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-primary">
                    ${car.pricePerDay}
                  </span>
                  <span className="text-gray-600 ml-2">/day</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full btn-primary mb-4"
              >
                Book Now
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Free cancellation</span>
                  <span className="text-primary font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance included</span>
                  <span className="text-primary font-medium">✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Instant confirmation</span>
                  <span className="text-primary font-medium">✓</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Owner Information</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-medium">{car.owner?.name || 'Car Owner'}</p>
                    <p className="text-sm text-gray-600">Member since 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CarDetails;
