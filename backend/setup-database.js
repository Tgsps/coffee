// Database setup script for Coffee Shop
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

// Sample products data
const sampleProducts = [
  {
    name: "Ethiopia Yirgacheffe Single-Origin",
    description: "Floral and citrus-forward with a tea-like body. Washed process from Yirgacheffe; bright, elegant finish.",
    price: 18.99,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 120,
    featured: true,
    rating: 4.7,
    reviews: []
  },
  {
    name: "Colombia Supremo Single-Origin",
    description: "Balanced body with caramel sweetness and cocoa undertones. Crowd-pleasing daily brew.",
    price: 16.50,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 150,
    featured: true,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Kenya AA Single-Origin",
    description: "Vibrant acidity with blackcurrant, grapefruit, and wine-like complexity. Big, expressive cup.",
    price: 19.50,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 90,
    featured: true,
    rating: 4.8,
    reviews: []
  },
  {
    name: "Signature Espresso Blend",
    description: "Chocolate, almond, and orange zest with syrupy body. Built to shine in milk drinks.",
    price: 17.50,
    category: "espresso",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 200,
    featured: true,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Midnight Dark Roast",
    description: "Deep roast with dark chocolate, molasses, and a lingering, smooth finish. Low acidity.",
    price: 16.75,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 110,
    featured: false,
    rating: 4.4,
    reviews: []
  },
  {
    name: "House Medium Roast",
    description: "Balanced and smooth with notes of milk chocolate and toasted hazelnut. All-day drinker.",
    price: 16.25,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 160,
    featured: false,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Swiss Water Decaf",
    description: "Chemical-free decaf with notes of cocoa and caramel. Full flavor, no jitters.",
    price: 17.00,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 95,
    featured: false,
    rating: 4.3,
    reviews: []
  },
  {
    name: "Organic Fair Trade Blend",
    description: "Certified organic and fair trade. Brown sugar sweetness, red fruit, and clean finish.",
    price: 18.25,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 130,
    featured: true,
    rating: 4.7,
    reviews: []
  },
  {
    name: "Cold Brew Bean Blend",
    description: "Crafted for cold brew: velvety body, low acidity, with cocoa and caramel sweetness.",
    price: 16.75,
    category: "cold-brew",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 180,
    featured: true,
    rating: 4.7,
    reviews: []
  },
  {
    name: "Ready-to-Drink Cold Brew (12oz Bottle)",
    description: "Smooth, slow-steeped cold brew with chocolatey sweetness and a clean finish.",
    price: 4.99,
    category: "cold-brew",
    image: "https://images.unsplash.com/photo-1494314671902-399b18174975?q=80&w=1200&auto=format&fit=crop",
    images: [],
    inStock: true,
    stockQuantity: 300,
    featured: false,
    rating: 4.5,
    reviews: []
  }
];

async function setupDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log('❌ No MONGODB_URI found in .env file');
      console.log('Please set up MongoDB Atlas and add your connection string to .env');
      return;
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Insert sample products
    console.log('📦 Inserting sample products...');
    await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${sampleProducts.length} products`);

    console.log('🎉 Database setup completed successfully!');
    console.log('You can now start your server with: npm run dev');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
