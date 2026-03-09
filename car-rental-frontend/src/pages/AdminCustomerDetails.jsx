import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { getCustomerDetails, updateVerificationStatus } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const data = await getCustomerDetails(id);
      setCustomer(data.customer);
      setBookings(data.bookings);
      setStats(data.stats);
      setVerificationNotes(data.customer.verificationNotes || '');
    } catch (error) {
      toast.error('Failed to fetch customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationUpdate = async (isVerified) => {
    try {
      await updateVerificationStatus(id, { isVerified, verificationNotes });
      toast.success(`Customer ${isVerified ? 'verified' : 'unverified'} successfully`);
      fetchCustomerDetails();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Customer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/admin/users" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    {customer.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                <p className="text-gray-600">{customer.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    Joined {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Verification Status</span>
                  {customer.isVerified ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>

                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Verification notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                  rows="3"
                />

                <div className="flex gap-2">
                  {!customer.isVerified && (
                    <button
                      onClick={() => handleVerificationUpdate(true)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Verify
                    </button>
                  )}
                  {customer.isVerified && (
                    <button
                      onClick={() => handleVerificationUpdate(false)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm font-medium"
                    >
                      Unverify
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-bold text-gray-900">${stats?.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-bold text-gray-900">{stats?.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Bookings</span>
                  <span className="font-bold text-gray-900">{stats?.activeBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-bold text-gray-900">{stats?.completedBookings}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {booking.car?.image && (
                          <img
                            src={booking.car.image}
                            alt={booking.car.name}
                            className="w-20 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.car?.name}</h4>
                          <p className="text-sm text-gray-600">{booking.car?.brand} {booking.car?.model}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${booking.totalPrice?.toFixed(2)}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No bookings yet</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetails;
