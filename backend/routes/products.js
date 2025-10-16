const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { store } = require('../data/memory');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 10 } = req.query;
    const useMemory = !process.env.MONGODB_URI;

    if (useMemory) {
      let products = [...store.products];
      if (category) products = products.filter(p => p.category === category);
      if (featured === 'true') products = products.filter(p => p.featured);
      if (search) {
        const s = String(search).toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
        );
      }

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const total = products.length;
      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum;
      const slice = products.slice(start, end);

      return res.json({
        products: slice,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        total
      });
    }

    // MongoDB mode
    const query = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({ products, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const useMemory = !process.env.MONGODB_URI;
    if (useMemory) {
      const product = store.products.find(p => p._id === req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', adminAuth, [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isIn(['coffee', 'espresso', 'latte', 'cappuccino', 'cold-brew', 'specialty']).withMessage('Invalid category'),
  body('image').trim().notEmpty().withMessage('Image URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const useMemory = !process.env.MONGODB_URI;
    if (useMemory) {
      const newItem = { _id: `mem-${Date.now()}`, reviews: [], ...req.body };
      store.products.unshift(newItem);
      return res.status(201).json(newItem);
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('category').optional().isIn(['coffee', 'espresso', 'latte', 'cappuccino', 'cold-brew', 'specialty']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const useMemory = !process.env.MONGODB_URI;
    if (useMemory) {
      const idx = store.products.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Product not found' });
      store.products[idx] = { ...store.products[idx], ...req.body };
      return res.json(store.products[idx]);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const useMemory = !process.env.MONGODB_URI;
    if (useMemory) {
      const prevLen = store.products.length;
      store.products = store.products.filter(p => p._id !== req.params.id);
      if (store.products.length === prevLen) return res.status(404).json({ message: 'Product not found' });
      return res.json({ message: 'Product deleted successfully' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const useMemory = !process.env.MONGODB_URI;
    const { rating, comment } = req.body;

    if (useMemory) {
      const product = store.products.find(p => p._id === req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      product.reviews = product.reviews || [];
      product.reviews.push({ rating, comment, createdAt: new Date() });
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = totalRating / product.reviews.length;
      return res.status(201).json({ message: 'Review added successfully' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const review = { user: req.user._id, rating, comment };
    product.reviews.push(review);
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
