import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Search, Eye } from 'lucide-react';
import { getAllBookingsAdmin, updateBookingStatus } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, paymentFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookingsAdmin({
        page,
        status: statusFilter,
        paymentStatus: paymentFilter,
      });
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            Booking Management
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {booking._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                      <div className="text-sm text-gray-500">{booking.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.car?.name}</div>
                      <div className="text-sm text-gray-500">{booking.car?.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString()} -<br />
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${booking.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/bookings/${booking._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-5 w-5 inline" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-outline disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
