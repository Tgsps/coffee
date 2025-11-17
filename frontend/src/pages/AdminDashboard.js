import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Failed to load dashboard</h2>
          <button
            onClick={fetchStats}
            className="bg-white text-charcoal-900 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue?.toFixed(2) || '0.00'}`,
      icon: '💰',
      color: 'bg-gold-400',
      link: '/admin/orders'
    },
    {
      title: 'Total Orders',
      value: stats.orders?.total || 0,
      icon: '📦',
      color: 'bg-rose-400',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.products?.total || 0,
      icon: '☕',
      color: 'bg-earth-400',
      link: '/admin/products'
    },
    {
      title: 'Total Users',
      value: stats.users?.total || 0,
      icon: '👥',
      color: 'bg-gold-300',
      link: '/admin/users'
    }
  ];

  const detailCards = [
    {
      title: 'Pending Orders',
      value: stats.orders?.pending || 0,
      color: 'text-gold-400'
    },
    {
      title: 'Paid Orders',
      value: stats.orders?.paid || 0,
      color: 'text-rose-400'
    },
    {
      title: 'Delivered Orders',
      value: stats.orders?.delivered || 0,
      color: 'text-earth-400'
    },
    {
      title: 'Products In Stock',
      value: stats.products?.inStock || 0,
      color: 'text-gold-400'
    },
    {
      title: 'Out of Stock',
      value: stats.products?.outOfStock || 0,
      color: 'text-rose-400'
    },
    {
      title: 'Admin Users',
      value: stats.users?.admins || 0,
      color: 'text-earth-400'
    }
  ];

  const sidebarItems = [
    { name: 'Dashboard', icon: '📊', link: '/admin', active: true },
    { name: 'Orders', icon: '📦', link: '/admin/orders' },
    { name: 'Products', icon: '☕', link: '/admin/products' },
    { name: 'Users', icon: '👥', link: '/admin/users' },
    { name: 'Settings', icon: '⚙️', link: '/admin/settings' },
  ];

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const analytics = {
    weeklySales: stats.analytics?.weeklySales || [
      { day: 'Mon', amount: 1200 },
      { day: 'Tue', amount: 1680 },
      { day: 'Wed', amount: 1420 },
      { day: 'Thu', amount: 1980 },
      { day: 'Fri', amount: 2320 },
      { day: 'Sat', amount: 1760 },
      { day: 'Sun', amount: 1540 }
    ],
    topProducts:
      stats.analytics?.topProducts ||
      stats.products?.top ||
      [
        { name: 'Ethiopia Yirgacheffe', revenue: 4200, orders: 58 },
        { name: 'Signature Espresso', revenue: 3650, orders: 51 },
        { name: 'Kenya AA', revenue: 2980, orders: 37 }
      ],
    customerInsights:
      stats.analytics?.customerInsights || {
        returningRate: 62,
        averageOrderValue: 38.5,
        subscribers: 112
      }
  };

  const maxWeeklySales = Math.max(...analytics.weeklySales.map((item) => item.amount), 1);

  return (
    <div className="min-h-screen bg-charcoal-900 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal-800 border-r border-charcoal-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
        <div className="p-6 border-b border-charcoal-700">
          <span className="font-serif text-2xl font-bold text-white">21coffee</span>
          <span className="text-white/60 text-sm ml-2">Admin</span>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-charcoal-700 text-white'
                  : 'text-white/60 hover:text-white hover:bg-charcoal-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navbar */}
        <header className="bg-charcoal-800 border-b border-charcoal-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white/90 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-serif font-bold text-white">Dashboard</h1>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
        </header>

        {/* Main Area */}
        <main className="p-6 lg:p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-white/60">Here's an overview of your store performance.</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-wrap gap-4"
          >
            <Link
              to="/admin/products"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium transition-all border border-white/20"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium transition-all border border-white/20"
            >
              Manage Orders
            </Link>
            <Link
              to="/admin/users"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium transition-all border border-white/20"
            >
              Manage Users
            </Link>
          </motion.div>

          {/* Main Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={stat.link}
                  className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 hover:border-charcoal-600 transition-all block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                    <div className={`${stat.color} text-charcoal-900 text-2xl p-3 rounded-full`}>
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Detail Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {detailCards.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6"
              >
                <p className="text-white/60 text-sm mb-2">{detail.title}</p>
                <p className={`text-3xl font-bold ${detail.color}`}>{detail.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm uppercase tracking-[0.3em]">Sales Trend</p>
                  <h2 className="text-2xl font-serif font-semibold text-white">Weekly revenue</h2>
                </div>
                <span className="text-white/60 text-sm">USD</span>
              </div>
              <div className="flex items-end gap-3 h-48">
                {analytics.weeklySales.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-full bg-gradient-to-b from-gold-400 to-rose-400"
                      style={{
                        height: `${Math.max((day.amount / maxWeeklySales) * 100, 8)}%`
                      }}
                    />
                    <p className="text-white/60 text-xs mt-3 uppercase tracking-widest">{day.day}</p>
                    <p className="text-white text-sm font-semibold">{formatCurrency(day.amount)}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm uppercase tracking-[0.3em]">Top Products</p>
                  <h2 className="text-2xl font-serif font-semibold text-white">Revenue leaders</h2>
                </div>
                <Link
                  to="/admin/products"
                  className="text-sm text-gold-400 hover:text-gold-300 font-semibold"
                >
                  Manage →
                </Link>
              </div>
              <div className="space-y-4">
                {analytics.topProducts.map((product, idx) => (
                  <div
                    key={`${product.name}-${idx}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-charcoal-900/40 border border-charcoal-700"
                  >
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-white/60 text-sm">{product.orders || 0} orders</p>
                    </div>
                    <p className="text-xl font-semibold text-gold-300">
                      {formatCurrency(product.revenue || product.sales || 0)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: 'Returning customers',
                value: `${analytics.customerInsights.returningRate || 0}%`,
                caption: 'Customers ordering 2+ times'
              },
              {
                label: 'Avg. order value',
                value: formatCurrency(analytics.customerInsights.averageOrderValue || 0),
                caption: 'Rolling 30-day average'
              },
              {
                label: 'Subscribers',
                value: analytics.customerInsights.subscribers || 0,
                caption: 'Active brew club members'
              }
            ].map((card, idx) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6"
              >
                <p className="text-white/60 text-sm uppercase tracking-[0.3em] mb-2">{card.label}</p>
                <p className="text-4xl font-serif font-semibold text-white mb-1">{card.value}</p>
                <p className="text-white/60 text-sm">{card.caption}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders Table */}
          {stats.recentOrders && stats.recentOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-charcoal-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-700">
                    {stats.recentOrders.map((order, idx) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + idx * 0.05 }}
                        className="hover:bg-charcoal-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {order._id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {order.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                          ${order.totalPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                              order.isDelivered
                                ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                                : order.isPaid
                                ? 'bg-rose-400/20 text-rose-400 border border-rose-400/30'
                                : 'bg-earth-400/20 text-earth-400 border border-earth-400/30'
                            }`}
                          >
                            {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/admin/orders"
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                >
                  View all orders →
                </Link>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
