const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = process.env.MONGODB_URI ? require('../models/Order') : null;
const Product = process.env.MONGODB_URI ? require('../models/Product') : null;
const db = require('../database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, [
  body('orderItems').isArray({ min: 1 }).withMessage('Order items are required'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('paymentMethod').isIn(['stripe', 'paypal', 'cash']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Calculate prices
    let itemsPrice = 0;
    const orderItemsWithPrices = [];

    if (Product && Order) {
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.product} not found` });
        }
        const itemPrice = product.price * item.quantity;
        itemsPrice += itemPrice;
        orderItemsWithPrices.push({ product: item.product, quantity: item.quantity, price: product.price });
      }
    } else {
      for (const item of orderItems) {
        const product = await db.getProductById(item.product);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.product} not found` });
        }
        const itemPrice = product.price * item.quantity;
        itemsPrice += itemPrice;
        orderItemsWithPrices.push({ product: item.product, quantity: item.quantity, price: product.price });
      }
    }

    const taxPrice = itemsPrice * 0.1; // 10% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    if (Order) {
      const order = new Order({
        user: req.user._id,
        orderItems: orderItemsWithPrices,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });
      await order.save();
      return res.status(201).json(order);
    }

    const created = await db.createOrder({
      user: req.user._id,
      orderItems: orderItemsWithPrices,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString()
    });
    return res.status(201).json(created);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/myorders', auth, async (req, res) => {
  try {
    if (Order) {
      const orders = await Order.find({ user: req.user._id })
        .populate('orderItems.product', 'name image price')
        .sort({ createdAt: -1 });
      return res.json(orders);
    }
    const orders = await db.getOrdersByUser(req.user._id);
    return res.json(orders.sort((a, b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)));
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin only) - Must be before /:id route
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    if (Order) {
      const orders = await Order.find()
        .populate('orderItems.product', 'name image price')
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      return res.json(orders);
    }
    const orders = await db.getOrders();
    return res.json(orders.sort((a, b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)));
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    if (Order) {
      const order = await Order.findById(req.params.id)
        .populate('orderItems.product', 'name image price')
        .populate('user', 'name email');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      return res.json(order);
    }

    const all = await db.getOrders();
    const order = all.find(o => o._id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if ((order.user?._id || order.user)?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order to paid
router.put('/:id/pay', auth, async (req, res) => {
  try {
    if (Order) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = req.body;
      await order.save();
      return res.json(order);
    }

    const all = await db.getOrders();
    const order = all.find(o => o._id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if ((order.user?._id || order.user)?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updated = await db.updateOrder(req.params.id, {
      isPaid: true,
      paidAt: new Date().toISOString(),
      paymentResult: req.body
    });
    return res.json(updated);
  } catch (error) {
    console.error('Update order payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order to delivered (Admin only)
router.put('/:id/deliver', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    if (Order) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      return res.json(order);
    }

    const updated = await db.updateOrder(req.params.id, {
      isDelivered: true,
      deliveredAt: new Date().toISOString()
    });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Update order delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
