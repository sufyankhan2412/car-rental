import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Car, MapPin, ArrowRight } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import useStore from '../store/useStore';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearBooking } = useStore();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setLoading(false);
    }

    // Clear booking from store
    clearBooking();
  }, [searchParams]);

  const verifyPayment = async (sessionId) => {
    try {
      const status = await paymentService.getPaymentStatus(sessionId);
      setPaymentStatus(status);
      
      // Get booking ID from URL or session metadata
      const bookingId = searchParams.get('bookingId');
      
      // If payment is successful and we have a booking ID, mark it as complete
      if (status.status === 'paid' && bookingId) {
        try {
          await paymentService.markPaymentComplete(bookingId);
          console.log('Payment marked as complete');
        } catch (error) {
          console.error('Failed to mark payment complete:', error);
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card-premium p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6"
          >
            <CheckCircle className="h-12 w-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-heading font-black text-secondary mb-4"
          >
            Booking Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Your payment was successful and your booking is confirmed.
          </motion.p>

          {/* Payment Details */}
          {paymentStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-xl p-6 mb-8 text-left"
            >
              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600 capitalize">{paymentStatus.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold">${paymentStatus.amountTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{paymentStatus.customerEmail}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left"
          >
            <h3 className="font-semibold text-lg mb-4 text-blue-900">What's Next?</h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>You'll receive a confirmation email with booking details</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>The car owner will contact you to arrange pickup</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>You can view and manage your booking in your dashboard</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>View My Bookings</span>
            </button>
            <button
              onClick={() => navigate('/cars')}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <Car className="h-5 w-5" />
              <span>Browse More Cars</span>
            </button>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-8 border-t text-sm text-gray-600"
          >
            <p>
              Need help? Contact our support team at{' '}
              <a href="mailto:support@driveeasy.com" className="text-primary hover:text-emerald-600 font-medium">
                support@driveeasy.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccess;
