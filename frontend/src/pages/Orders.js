import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders/myorders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (order) => {
    if (order.isDelivered) {
      return { text: 'Delivered', color: 'bg-gold-400/20 text-gold-400 border-gold-400/30' };
    }
    if (order.isPaid) {
      return { text: 'Processing', color: 'bg-rose-400/20 text-rose-400 border-rose-400/30' };
    }
    return { text: 'Pending Payment', color: 'bg-earth-400/20 text-earth-400 border-earth-400/30' };
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (filter === 'delivered') return order.isDelivered;
        if (filter === 'processing') return order.isPaid && !order.isDelivered;
        if (filter === 'pending') return !order.isPaid;
        return true;
      });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in</h1>
          <p className="text-white/60">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            My Orders
          </h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['all', 'pending', 'processing', 'delivered'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? 'bg-white text-charcoal-900'
                    : 'bg-charcoal-800 border border-charcoal-700 text-white/60 hover:text-white hover:border-charcoal-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-3xl font-serif font-semibold text-white mb-4">
              No orders yet
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Start shopping to see your orders here
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-charcoal-900 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60">No orders found with the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, idx) => {
              const status = getStatusBadge(order);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-charcoal-800 border border-charcoal-700 rounded-2xl overflow-hidden hover:border-charcoal-600 transition-all"
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-serif font-semibold text-white mb-2">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-white/60">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 text-left md:text-right">
                        <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${status.color} mb-3 md:mb-0`}>
                          {status.text}
                        </div>
                        <p className="text-2xl font-bold text-white mt-3 md:mt-1">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-white mb-4">Items</h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-white/60">
                                  Qty: {item.quantity} × ${item.price}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-white">
                                ${(item.quantity * item.price).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium text-white mb-4">Shipping Address</h4>
                        <div className="text-sm text-white/60 leading-relaxed">
                          <p className="font-medium text-white">{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="pt-6 border-t border-charcoal-700">
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-white/60">Subtotal:</span>
                          <span className="text-white">${order.itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Shipping:</span>
                          <span className="text-white">
                            {order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Tax:</span>
                          <span className="text-white">${order.taxPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-charcoal-700">
                          <span>Total:</span>
                          <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Link
                        to={`/orders/${order._id}`}
                        className="border-2 border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-all font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
