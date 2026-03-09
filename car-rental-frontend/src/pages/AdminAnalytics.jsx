import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Car, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { getRevenueAnalytics, getDashboardStats } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, statsData] = await Promise.all([
        getRevenueAnalytics(),
        getDashboardStats()
      ]);
      setAnalytics(analyticsData);
      setStats(statsData.stats);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Rentals',
      value: stats?.activeRentals || 0,
      change: '+5.1%',
      trend: 'up',
      icon: Car,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="h-10 w-10 text-blue-600" />
                Analytics & Insights
              </h1>
              <p className="text-gray-600 mt-2">Track your business performance and growth</p>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{kpi.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              Daily Revenue
            </h2>
            <div className="space-y-3">
              {analytics?.dailyRevenue?.slice(0, 10).map((item, index) => {
                const maxRevenue = Math.max(...(analytics.dailyRevenue.map(r => r.revenue) || [1]));
                const percentage = (item.revenue / maxRevenue) * 100;
                const date = new Date(item._id.year, item._id.month - 1, item._id.day);
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24 font-medium">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-10 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.6 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-3"
                      >
                        <span className="text-white text-sm font-bold">${item.revenue.toFixed(0)}</span>
                      </motion.div>
                    </div>
                    <span className="text-sm text-gray-500 w-20 text-right">{item.count} bookings</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Top Performing Cars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              Top Performing Cars
            </h2>
            <div className="space-y-4">
              {analytics?.revenueByCar?.slice(0, 8).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.carDetails?.name || 'Unknown'}</h3>
                      <p className="text-sm text-gray-500">{item.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${item.revenue.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Average Booking Value</h3>
            <p className="text-4xl font-bold mb-2">
              ${stats?.totalRevenue && stats?.totalBookings 
                ? (stats.totalRevenue / stats.totalBookings).toFixed(2) 
                : '0.00'}
            </p>
            <p className="text-blue-100 text-sm">Per booking</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Fleet Utilization</h3>
            <p className="text-4xl font-bold mb-2">
              {stats?.totalCars && stats?.availableCars
                ? Math.round(((stats.totalCars - stats.availableCars) / stats.totalCars) * 100)
                : 0}%
            </p>
            <p className="text-purple-100 text-sm">
              {stats?.totalCars - stats?.availableCars || 0} of {stats?.totalCars || 0} cars rented
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Verified Users</h3>
            <p className="text-4xl font-bold mb-2">
              {stats?.totalUsers && stats?.verifiedUsers
                ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100)
                : 0}%
            </p>
            <p className="text-orange-100 text-sm">
              {stats?.verifiedUsers || 0} of {stats?.totalUsers || 0} users
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
