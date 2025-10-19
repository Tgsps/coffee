const jwt = require('jsonwebtoken');
const User = process.env.MONGODB_URI ? require('../models/User') : null;
const db = require('../database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    let user;
    if (User) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      // Memory mode: fetch user via db abstraction and strip password
      const found = await db.getUserById(decoded.id);
      if (found) {
        const { password, ...rest } = found;
        user = rest;
      }
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, adminAuth };
