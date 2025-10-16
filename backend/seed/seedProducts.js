const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-shop';

const products = [
  {
    name: 'Ethiopian Yirgacheffe',
    description: 'Floral aroma with citrus notes and a bright, tea-like body. Washed process from the Yirgacheffe region.',
    price: 18.99,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 120,
    featured: true,
    rating: 4.6
  },
  {
    name: 'Colombian Supremo',
    description: 'Balanced cup with caramel sweetness, chocolate notes, and a smooth finish. Medium roast.',
    price: 16.5,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 150,
    featured: true,
    rating: 4.5
  },
  {
    name: 'Brazil Santos',
    description: 'Nutty and chocolatey with low acidity. Great for espresso and milk-based drinks.',
    price: 15.0,
    category: 'espresso',
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 200,
    featured: false,
    rating: 4.3
  },
  {
    name: 'Guatemala Antigua',
    description: 'Rich cocoa and spice with a velvety body. High-grown beans with complex flavors.',
    price: 17.25,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 100,
    featured: false,
    rating: 4.4
  },
  {
    name: 'Cold Brew Blend',
    description: 'Special blend crafted for smooth, low-acidity cold brew with chocolate and caramel notes.',
    price: 16.75,
    category: 'cold-brew',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 180,
    featured: true,
    rating: 4.7
  },
  {
    name: 'House Latte Blend',
    description: 'Medium-dark roast designed to shine through milk. Notes of cocoa and toasted nuts.',
    price: 16.0,
    category: 'latte',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 160,
    featured: false,
    rating: 4.2
  },
  {
    name: 'Signature Cappuccino Blend',
    description: 'Balanced blend for cappuccino with creamy body and sweet chocolate finish.',
    price: 16.25,
    category: 'cappuccino',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 140,
    featured: false,
    rating: 4.1
  },
  {
    name: 'Kenya AA',
    description: 'Bright acidity with berry and wine-like notes. Powerful and complex cup profile.',
    price: 19.5,
    category: 'specialty',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop',
    images: [],
    inStock: true,
    stockQuantity: 90,
    featured: true,
    rating: 4.8
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const created = await Product.insertMany(products);
    console.log(`Inserted ${created.length} products`);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();


