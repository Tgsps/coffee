const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from frontend/public so root index.html links resolve
app.use('/frontend/public', express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Serve frontend build (production)
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Database connection
const db = require('./database');

// Initialize database connection
db.connect().then(async (connected) => {
  if (connected) {
    // Seed database with sample data
    await db.seedData();
  } else {
    // Use in-memory storage with sample data
    await db.seedData();
  }

  // Ensure default admin user exists
  try {
    await db.ensureAdminUser({
      email: 'tamimghassan@gmail.com',
      password: '1234567890',
      name: 'Admin'
    });
    console.log('✅ Ensured default admin user exists');
  } catch (e) {
    console.error('⚠️ Failed to ensure default admin user:', e?.message || e);
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Coffee Shop API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// SPA fallback: serve index.html for any non-API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
