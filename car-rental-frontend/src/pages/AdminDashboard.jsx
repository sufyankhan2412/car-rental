import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { getDashboardStats } from '../services/adminService';
import useStore from '../store/useStore';

const AdminDashboard = () => {
  const { user } = useStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.stats.totalBookings || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      link: '/admin/bookings',
    },
    {
      title: 'Active Rentals',
      value: stats?.stats.activeRentals || 0,
      icon: Clock,
      color: 'bg-green-500',
      link: '/admin/bookings?status=active',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.stats.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      link: '/admin/analytics',
    },
    {
      title: 'Available Cars',
      value: `${stats?.stats.availableCars}/${stats?.stats.totalCars}`,
      icon: Car,
      color: 'bg-purple-500',
      link: '/admin/cars',
    },
    {
      title: 'Total Users',
      value: stats?.stats.totalUsers || 0,
      icon: Users,
      color: 'bg-orange-500',
      link: '/admin/users',
    },
    {
      title: 'Verified Users',
      value: stats?.stats.verifiedUsers || 0,
      icon: CheckCircle,
      color: 'bg-teal-500',
      link: '/admin/users?verified=true',
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentBookings?.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.car?.name}</p>
                    <p className="text-sm text-gray-600">{booking.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${booking.totalPrice}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                <p className="text-center text-gray-500 py-4">No recent bookings</p>
              )}
            </div>
          </motion.div>

          {/* Bookings by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h2>
            <div className="space-y-3">
              {stats?.bookingsByStatus?.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      item._id === 'confirmed' ? 'bg-green-500' :
                      item._id === 'active' ? 'bg-blue-500' :
                      item._id === 'pending' ? 'bg-yellow-500' :
                      item._id === 'completed' ? 'bg-gray-500' :
                      'bg-red-500'
                    }`}></span>
                    <span className="text-gray-700 capitalize">{item._id}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-md p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Trend (Last 6 Months)
              </h2>
              <Link to="/admin/analytics" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Analytics →
              </Link>
            </div>
            <div className="space-y-2">
              {stats?.revenueByMonth?.map((item, index) => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[item._id.month - 1];
                const maxRevenue = Math.max(...(stats.revenueByMonth.map(r => r.revenue) || [1]));
                const percentage = (item.revenue / maxRevenue) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-12">{monthName}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full flex items-center justify-end pr-3"
                      >
                        <span className="text-white text-sm font-medium">${item.revenue.toFixed(0)}</span>
                      </motion.div>
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">{item.count} bookings</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Link to="/admin/cars" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <Car className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Cars</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove vehicles</p>
          </Link>
          <Link to="/admin/bookings" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
            <p className="text-sm text-gray-600">View and update bookings</p>
          </Link>
          <Link to="/admin/users" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <Users className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">User accounts and roles</p>
          </Link>
          <Link to="/admin/payments" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <DollarSign className="h-8 w-8 text-emerald-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Payments</h3>
            <p className="text-sm text-gray-600">View and refund payments</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
