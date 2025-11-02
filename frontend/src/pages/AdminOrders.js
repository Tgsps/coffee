import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/deliver`);
      toast.success('Order marked as delivered');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (order) => {
    const isDelivered = order.isDelivered;
    const isPaid = order.isPaid;
    
    if (isDelivered) {
      return { label: 'Delivered', color: 'bg-earth-400/20 text-earth-400 border-earth-400/30' };
    } else if (isPaid) {
      return { label: 'Shipped', color: 'bg-gold-400/20 text-gold-400 border-gold-400/30' };
    } else {
      return { label: 'Pending', color: 'bg-rose-400/20 text-rose-400 border-rose-400/30' };
    }
  };

  const getPaymentBadge = (order) => {
    return order.isPaid 
      ? { label: 'Paid', color: 'bg-earth-400/20 text-earth-400 border-earth-400/30' }
      : { label: 'Pending', color: 'bg-gold-400/20 text-gold-400 border-gold-400/30' };
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Payment', 'Date'];
    const rows = filteredOrders.map(order => [
      order._id.slice(-8),
      order.user?.name || order.shippingAddress?.name || 'N/A',
      order.user?.email || 'N/A',
      `$${order.totalPrice?.toFixed(2) || '0.00'}`,
      getStatusBadge(order).label,
      getPaymentBadge(order).label,
      new Date(order.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported to CSV');
  };

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !order.isDelivered && !order.isPaid) ||
      (statusFilter === 'shipped' && !order.isDelivered && order.isPaid) ||
      (statusFilter === 'delivered' && order.isDelivered) ||
      (statusFilter === 'canceled' && order.status === 'canceled');
    
    const matchesPayment = 
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && order.isPaid) ||
      (paymentFilter === 'pending' && !order.isPaid);
    
    const matchesDate = 
      (!dateRange.start || new Date(order.createdAt) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(order.createdAt) <= new Date(dateRange.end + 'T23:59:59'));
    
    return matchesStatus && matchesPayment && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                Orders Overview
              </h1>
              <p className="text-white/60">View and manage all customer orders</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin"
                className="px-6 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-lg hover:bg-charcoal-700 transition-all"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={exportToCSV}
                className="px-6 py-3 bg-gold-400 text-charcoal-900 rounded-lg font-semibold hover:bg-gold-300 transition-all"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-4 flex-1">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-charcoal-800 border border-charcoal-700 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-charcoal-700">
              <thead className="bg-charcoal-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-charcoal-800 divide-y divide-charcoal-700">
                {filteredOrders.map((order, idx) => {
                  const statusBadge = getStatusBadge(order);
                  const paymentBadge = getPaymentBadge(order);
                  const isExpanded = expandedOrder === order._id;

                  return (
                    <React.Fragment key={order._id}>
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        className="hover:bg-charcoal-700/50 transition-all cursor-pointer group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            #{order._id.slice(-8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {order.user?.name || order.shippingAddress?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-white/60">
                            {order.user?.email || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-white">
                            ${order.totalPrice?.toFixed(2) || '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white/70">
                            {order.paymentMethod || 'N/A'}
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${paymentBadge.color} inline-block mt-1`}>
                            {paymentBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {!order.isDelivered && order.isPaid && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkDelivered(order._id);
                                }}
                                className="px-3 py-1 bg-earth-400/20 text-earth-400 border border-earth-400/30 rounded-lg hover:bg-earth-400/30 transition-all text-xs"
                              >
                                Mark Delivered
                              </button>
                            )}
                            <svg
                              className={`w-5 h-5 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </td>
                      </motion.tr>
                      
                      {/* Collapsible Order Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-charcoal-900/50"
                          >
                            <td colSpan={7} className="px-6 py-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Items */}
                                <div>
                                  <h4 className="text-sm font-semibold text-white mb-3">Order Items</h4>
                                  <div className="space-y-2">
                                    {(order.orderItems || order.items || []).map((item, itemIdx) => (
                                      <div key={itemIdx} className="flex items-center gap-3 bg-charcoal-800 rounded-lg p-3">
                                        <div className="text-sm text-white/70">
                                          {item.quantity}x {item.product?.name || item.productDetails?.name || 'N/A'}
                                        </div>
                                        <div className="ml-auto text-sm font-medium text-white">
                                          ${((item.product?.price || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Shipping Address */}
                                <div>
                                  <h4 className="text-sm font-semibold text-white mb-3">Shipping Address</h4>
                                  <div className="bg-charcoal-800 rounded-lg p-3 text-sm text-white/70">
                                    {order.shippingAddress?.name && <div>{order.shippingAddress.name}</div>}
                                    {order.shippingAddress?.street && <div>{order.shippingAddress.street}</div>}
                                    <div>
                                      {[
                                        order.shippingAddress?.city,
                                        order.shippingAddress?.state,
                                        order.shippingAddress?.zipCode,
                                        order.shippingAddress?.country
                                      ]
                                        .filter(Boolean)
                                        .join(', ')}
                                    </div>
                                  </div>
                                  
                                  {/* Tracking Info */}
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-white mb-3">Tracking</h4>
                                    <div className="text-sm text-white/60">
                                      {order.trackingNumber || 'No tracking number available'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">No orders found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOrders;
