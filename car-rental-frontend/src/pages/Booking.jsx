import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useStore from '../store/useStore';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

const Booking = () => {
  const navigate = useNavigate();
  const { selectedCar, bookingDates, setBookingDates, setCurrentBooking } = useStore();
  const [startDate, setStartDate] = useState(bookingDates.startDate || new Date());
  const [endDate, setEndDate] = useState(bookingDates.endDate || new Date());
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryOption, setDeliveryOption] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCar) {
      navigate('/cars');
      return;
    }
    calculatePrice();
  }, [startDate, endDate, deliveryOption]);

  const calculatePrice = async () => {
    if (!selectedCar || !startDate || !endDate) return;

    try {
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const basePrice = selectedCar.pricePerDay * days;
      const deliveryFee = deliveryOption ? 50 : 0;
      const serviceFee = basePrice * 0.1;
      const total = basePrice + deliveryFee + serviceFee;

      setPricing({
        days,
        basePrice,
        deliveryFee,
        serviceFee,
        total,
      });
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const handleBooking = async () => {
    if (!pickupLocation) {
      toast.error('Please enter pickup location');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        carId: selectedCar._id,
        startDate,
        endDate,
        pickupLocation,
        deliveryOption,
        totalPrice: pricing.total,
      };

      const response = await bookingService.createBooking(bookingData);
      setCurrentBooking(response);
      setBookingDates({ startDate, endDate });
      toast.success('Booking created successfully!');
      navigate('/checkout');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCar) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-secondary mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">Review details and confirm your reservation</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Selected Vehicle</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={selectedCar.image || 'https://via.placeholder.com/150'}
                  alt={selectedCar.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedCar.name}</h3>
                  <p className="text-gray-600">{selectedCar.location}</p>
                  <p className="text-primary font-semibold mt-1">
                    ${selectedCar.pricePerDay}/day
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Rental Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={new Date()}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    minDate={startDate}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Pickup Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="input-field"
                    placeholder="Enter pickup address"
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={deliveryOption}
                    onChange={(e) => setDeliveryOption(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Delivery to my location (+$50)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Price Summary
              </h2>

              {pricing && (
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>${selectedCar.pricePerDay} × {pricing.days} days</span>
                    <span>${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  {deliveryOption && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery fee</span>
                      <span>${pricing.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Service fee</span>
                    <span>${pricing.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full btn-primary mt-6"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <p>✓ Free cancellation up to 24 hours</p>
                <p>✓ Insurance included</p>
                <p>✓ 24/7 roadside assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
