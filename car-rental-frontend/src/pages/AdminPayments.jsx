import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { getAllPayments, refundPayment } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments({ page, status: statusFilter });
      setPayments(data.payments);
      setTotals(data.totals);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (bookingId) => {
    if (!window.confirm('Are you sure you want to refund this payment? This action cannot be undone.')) {
      return;
    }

    try {
      await refundPayment(bookingId);
      toast.success('Payment refunded successfully');
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to refund payment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      refunded: 'bg-blue-100 text-blue-800 border-blue-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="h-8 w-8" />
            Payment Management
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {totals.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${getStatusColor(item._id)}`}>
                {item._id.toUpperCase()}
              </div>
              <p className="text-2xl font-bold text-gray-900">${item.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{item.count} transactions</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={fetchPayments}
              className="btn-outline flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rental Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {payment.paymentIntentId?.slice(-12) || payment._id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.user?.name}</div>
                      <div className="text-sm text-gray-500">{payment.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.car?.name}</div>
                      <div className="text-sm text-gray-500">{payment.car?.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.startDate).toLocaleDateString()} -<br />
                      {new Date(payment.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        ${payment.totalPrice?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/bookings/${payment._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        {payment.paymentStatus === 'paid' && (
                          <button
                            onClick={() => handleRefund(payment._id)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Refund Payment"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && !loading && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payments found</p>
            </div>
          )}

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

export default AdminPayments;
