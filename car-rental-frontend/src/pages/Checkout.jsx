import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, Loader } from 'lucide-react';
import useStore from '../store/useStore';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { currentBooking, clearBooking } = useStore();
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!currentBooking) {
    navigate('/cars');
    return null;
  }

  const handleStripeCheckout = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // Create Stripe checkout session
      const response = await paymentService.createCheckoutSession(currentBooking._id);
      
      // Redirect to Stripe checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-secondary mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600">Complete your payment to confirm booking</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Info */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Secure Payment with Stripe</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Your payment is processed securely through Stripe. We never store your card details.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ 256-bit SSL encryption</li>
                      <li>✓ PCI DSS compliant</li>
                      <li>✓ Secure card processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="rounded text-primary focus:ring-primary mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:text-emerald-600">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:text-emerald-600">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              <button
                onClick={handleStripeCheckout}
                disabled={loading || !agreedToTerms}
                className="w-full btn-primary flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Pay ${currentBooking.totalPrice} with Stripe
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mt-4">
                <Lock className="h-4 w-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentBooking.car?.image || 'https://via.placeholder.com/80'}
                    alt={currentBooking.car?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{currentBooking.car?.name}</h3>
                    <p className="text-sm text-gray-600">{currentBooking.car?.location}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental period</span>
                    <span className="font-medium">
                      {new Date(currentBooking.startDate).toLocaleDateString()} - {new Date(currentBooking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup location</span>
                    <span className="font-medium">{currentBooking.pickupLocation}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${(currentBooking.totalPrice * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service fee</span>
                    <span>${(currentBooking.totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">${currentBooking.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Free cancellation (24h)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Insurance included</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
