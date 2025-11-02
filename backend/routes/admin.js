const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = process.env.MONGODB_URI ? require('../models/Order') : null;
const Product = process.env.MONGODB_URI ? require('../models/Product') : null;
const User = process.env.MONGODB_URI ? require('../models/User') : null;
const db = require('../database');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    if (User && Product && Order) {
      // MongoDB mode
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      
      const totalRevenue = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);

      const recentOrders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        users: {
          total: totalUsers,
          admins: await User.countDocuments({ role: 'admin' })
        },
        products: {
          total: totalProducts,
          inStock: await Product.countDocuments({ inStock: true }),
          outOfStock: await Product.countDocuments({ inStock: false })
        },
        orders: {
          total: totalOrders,
          paid: await Order.countDocuments({ isPaid: true }),
          delivered: await Order.countDocuments({ isDelivered: true }),
          pending: await Order.countDocuments({ isPaid: false })
        },
        revenue: totalRevenue[0]?.total || 0,
        recentOrders
      });
    } else {
      // Memory mode
      const users = await db.getUsers();
      const products = await db.getProducts();
      const orders = await db.getOrders();

      const totalRevenue = orders
        .filter(o => o.isPaid)
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      res.json({
        users: {
          total: users.length,
          admins: users.filter(u => u.role === 'admin').length
        },
        products: {
          total: products.length,
          inStock: products.filter(p => p.inStock !== false).length,
          outOfStock: products.filter(p => p.inStock === false).length
        },
        orders: {
          total: orders.length,
          paid: orders.filter(o => o.isPaid).length,
          delivered: orders.filter(o => o.isDelivered).length,
          pending: orders.filter(o => !o.isPaid).length
        },
        revenue: totalRevenue,
        recentOrders
      });
    }
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    if (User) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json(users);
    } else {
      const users = await db.getUsers();
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPassword);
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (Admin only)
router.put('/users/:id', adminAuth, [
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;

    if (User) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } else {
      const updatedUser = await db.updateUser(req.params.id, { role });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
