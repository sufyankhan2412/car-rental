import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Car, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { getBookingById } from '../services/bookingService';
import { sendForSignature, getContractStatus } from '../services/contractService';
import useStore from '../store/useStore';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingContract, setSendingContract] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const data = await getBookingById(id);
      setBooking(data);
      
      // If booking has contract, fetch its status
      if (data.contract) {
        const contractData = await getContractStatus(id);
        setBooking(prev => ({ ...prev, contract: contractData.contract }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async () => {
    try {
      setSendingContract(true);
      const result = await sendForSignature(id);
      
      if (result.mode === 'production') {
        window.location.href = result.signingUrl;
      } else {
        navigate(`/sign-contract/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send contract');
    } finally {
      setSendingContract(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getContractStatusColor = (status) => {
    const colors = {
      not_generated: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-indigo-100 text-indigo-800',
      signed: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      voided: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This booking does not exist'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600 mt-1">Booking ID: {booking._id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Booking Status</h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                      booking.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                        : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    }`}>
                      {booking.paymentStatus === 'paid' ? '✓' : '⏳'} Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Car Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </h2>
              <div className="flex gap-4">
                {booking.car?.image && (
                  <img
                    src={booking.car.image}
                    alt={booking.car.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{booking.car?.name}</h3>
                  <p className="text-gray-600">{booking.car?.brand} {booking.car?.model}</p>
                  <p className="text-sm text-gray-500 mt-1">{booking.car?.year}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>{booking.car?.transmission}</span>
                    <span>•</span>
                    <span>{booking.car?.fuelType}</span>
                    <span>•</span>
                    <span>{booking.car?.seats} seats</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rental Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rental Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {startDate.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {endDate.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">Total Duration: {days} day{days !== 1 ? 's' : ''}</span>
              </div>
            </motion.div>

            {/* Location Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Pickup Location
              </h2>
              <p className="text-gray-900">{booking.pickupLocation}</p>
              {booking.deliveryOption && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">✓ Delivery service included</p>
                </div>
              )}
            </motion.div>

            {/* Contract Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rental Agreement
              </h2>
              
              {booking.contract ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Contract Number:</span>
                    <span className="font-mono font-medium text-gray-900">{booking.contract.contractNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getContractStatusColor(booking.contract.status)}`}>
                      {booking.contract.status === 'not_generated' ? 'Not Generated' :
                       booking.contract.status === 'pending' ? 'Ready to Sign' :
                       booking.contract.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  {booking.contract.generatedAt && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Generated:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(booking.contract.generatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {booking.contract.signedAt && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm text-green-700">Signed On:</span>
                      <span className="text-sm font-semibold text-green-900">
                        {new Date(booking.contract.signedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="pt-2">
                    {booking.contract.status === 'signed' ? (
                      <button
                        onClick={() => navigate(`/sign-contract/${id}`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        <FileText className="h-4 w-4" />
                        View Signed Contract
                      </button>
                    ) : booking.contract.status === 'sent' || booking.contract.status === 'delivered' ? (
                      <button
                        onClick={handleSignContract}
                        disabled={sendingContract}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300"
                      >
                        <FileText className="h-4 w-4" />
                        {sendingContract ? 'Loading...' : 'Continue Signing'}
                      </button>
                    ) : booking.contract.status === 'pending' && booking.paymentStatus === 'paid' ? (
                      <button
                        onClick={handleSignContract}
                        disabled={sendingContract}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300"
                      >
                        <FileText className="h-4 w-4" />
                        {sendingContract ? 'Preparing Contract...' : 'Sign Rental Agreement'}
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : booking.paymentStatus === 'paid' ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-gray-600 mb-4">Contract is being prepared...</p>
                  <button
                    onClick={handleSignContract}
                    disabled={sendingContract}
                    className="btn-primary"
                  >
                    {sendingContract ? 'Preparing...' : 'Generate Contract'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Contract will be available after payment confirmation
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Price Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Daily Rate</span>
                  <span>${booking.car?.pricePerDay}/day</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Duration</span>
                  <span>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                {booking.extras?.insurance && (
                  <div className="flex justify-between text-gray-600">
                    <span>Insurance</span>
                    <span>Included</span>
                  </div>
                )}
                {booking.extras?.gps && (
                  <div className="flex justify-between text-gray-600">
                    <span>GPS</span>
                    <span>Included</span>
                  </div>
                )}
                {booking.extras?.childSeat && (
                  <div className="flex justify-between text-gray-600">
                    <span>Child Seat</span>
                    <span>Included</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${booking.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            {booking.paymentStatus === 'paid' && booking.status === 'confirmed' && booking.contract?.status !== 'signed' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">Payment Confirmed!</h3>
                    <p className="text-sm text-green-700">Next: Sign your rental agreement</p>
                  </div>
                </div>
                <button
                  onClick={handleSignContract}
                  disabled={sendingContract}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md disabled:bg-gray-300"
                >
                  {sendingContract ? 'Preparing Contract...' : '📝 Sign Agreement Now'}
                </button>
              </motion.div>
            )}
            
            {booking.paymentStatus === 'pending' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">Payment Pending</h3>
                </div>
                <p className="text-sm text-yellow-800 mb-4">
                  Your payment is being processed. This usually takes a few moments.
                </p>
                <button
                  onClick={fetchBookingDetails}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  Refresh Status
                </button>
              </motion.div>
            )}

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Contact our support team for assistance with your booking.
              </p>
              <a
                href="mailto:support@driveeasy.com"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                support@driveeasy.com
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
