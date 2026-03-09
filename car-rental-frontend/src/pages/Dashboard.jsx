import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Car, CreditCard, User, Settings, LogOut, TrendingUp, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { bookingService } from '../services/bookingService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { id: 'profile', label: 'Profile', icon: User, color: 'from-purple-500 to-purple-600' },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard, color: 'from-green-500 to-green-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-orange-500 to-orange-600' },
  ];

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Trips', value: bookings.filter(b => b.status === 'confirmed').length, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: CheckCircle, color: 'from-purple-500 to-purple-600' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: XCircle, color: 'from-red-500 to-red-600' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-heading font-black text-secondary mb-2">
                Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>!
              </h1>
              <p className="text-gray-600">Manage your bookings and account settings</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            >
              {user?.name?.charAt(0) || 'U'}
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card-premium p-6 hover-glow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-black text-secondary">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </motion.button>
                ))}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-semibold">Logout</span>
                </motion.button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-secondary">My Bookings</h2>
                    <Link to="/cars" className="btn-primary">
                      Book New Car
                    </Link>
                  </div>
                  
                  {loading ? (
                    <LoadingSkeleton type="list" count={3} />
                  ) : bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking, index) => (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -4 }}
                          className="card-premium p-6 hover-glow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex space-x-4">
                              <div className="relative">
                                <img
                                  src={booking.car?.image || 'https://via.placeholder.com/120'}
                                  alt={booking.car?.name}
                                  className="w-28 h-28 object-cover rounded-xl"
                                />
                                <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-lg text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-secondary mb-2">{booking.car?.name}</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                                    <span className="font-medium">
                                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-primary" />
                                    <span>{booking.pickupLocation}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-right">
                                <p className="text-3xl font-black bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                  ${booking.totalPrice}
                                </p>
                                <p className="text-xs text-gray-500">Total Amount</p>
                              </div>
                              <Link
                                to={`/bookings/${booking._id}`}
                                className="text-sm text-primary hover:text-emerald-600 font-semibold transition-colors"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="card-premium p-16 text-center"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Car className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-secondary mb-2">No bookings yet</h3>
                      <p className="text-gray-600 mb-6">Start your journey by booking your first car</p>
                      <Link to="/cars" className="btn-primary">
                        Browse Cars
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-8"
                >
                  <h2 className="text-3xl font-bold text-secondary mb-8">Profile Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        className="input-field"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary"
                    >
                      Update Profile
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-8"
                >
                  <h2 className="text-3xl font-bold text-secondary mb-8">Payment Methods</h2>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-2">No payment methods added</h3>
                    <p className="text-gray-600 mb-6">Add a payment method to speed up checkout</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                    >
                      Add Payment Method
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-8"
                >
                  <h2 className="text-3xl font-bold text-secondary mb-8">Settings</h2>
                  <div className="space-y-6">
                    {[
                      { title: 'Email Notifications', desc: 'Receive booking updates via email', checked: true },
                      { title: 'SMS Notifications', desc: 'Receive booking updates via SMS', checked: false },
                      { title: 'Marketing Emails', desc: 'Receive promotional offers', checked: false },
                    ].map((setting, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all"
                      >
                        <div>
                          <p className="font-bold text-secondary">{setting.title}</p>
                          <p className="text-sm text-gray-600">{setting.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={setting.checked} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
