import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coffee-700"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-coffee-800 mb-4">Failed to load dashboard</h2>
          <button
            onClick={fetchStats}
            className="bg-coffee-700 text-white px-4 py-2 rounded-lg hover:bg-coffee-800"
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
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Orders',
      value: stats.orders?.total || 0,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.products?.total || 0,
      icon: '☕',
      color: 'bg-purple-500',
      link: '/admin/products'
    },
    {
      title: 'Total Users',
      value: stats.users?.total || 0,
      icon: '👥',
      color: 'bg-orange-500',
      link: '/admin/users'
    }
  ];

  const detailCards = [
    {
      title: 'Pending Orders',
      value: stats.orders?.pending || 0,
      color: 'text-yellow-600'
    },
    {
      title: 'Paid Orders',
      value: stats.orders?.paid || 0,
      color: 'text-green-600'
    },
    {
      title: 'Delivered Orders',
      value: stats.orders?.delivered || 0,
      color: 'text-blue-600'
    },
    {
      title: 'Products In Stock',
      value: stats.products?.inStock || 0,
      color: 'text-green-600'
    },
    {
      title: 'Out of Stock',
      value: stats.products?.outOfStock || 0,
      color: 'text-red-600'
    },
    {
      title: 'Admin Users',
      value: stats.users?.admins || 0,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-beige-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-coffee-800 mb-2">Admin Dashboard</h1>
          <p className="text-coffee-600">Welcome back! Here's an overview of your store.</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            to="/admin/products"
            className="bg-coffee-700 text-white px-4 py-2 rounded-lg hover:bg-coffee-800 transition-colors"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="bg-coffee-700 text-white px-4 py-2 rounded-lg hover:bg-coffee-800 transition-colors"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/users"
            className="bg-coffee-700 text-white px-4 py-2 rounded-lg hover:bg-coffee-800 transition-colors"
          >
            Manage Users
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-coffee-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white text-4xl p-4 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Detail Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {detailCards.map((detail, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <p className="text-gray-600 text-sm mb-2">{detail.title}</p>
              <p className={`text-2xl font-bold ${detail.color}`}>{detail.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        {stats.recentOrders && stats.recentOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-coffee-800 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.isDelivered
                              ? 'bg-green-100 text-green-800'
                              : order.isPaid
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/admin/orders"
                className="text-coffee-700 hover:text-coffee-800 font-medium"
              >
                View all orders →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

