// Database abstraction layer - supports both MongoDB and in-memory storage
let mongoose = null;
const bcrypt = require('bcryptjs');

// Only load mongoose if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  try {
    mongoose = require('mongoose');
  } catch (error) {
    console.log('MongoDB not available, using in-memory storage');
  }
}

// In-memory storage (fallback when MongoDB is not available)
const memoryStore = {
  products: [],
  users: [],
  orders: []
};

// MongoDB models
let Product, User, Order;

// Initialize MongoDB models if connection is available
function initializeModels() {
  if (mongoose && mongoose.connection.readyState === 1) {
    // Product Schema
    const productSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { 
        type: String, 
        enum: ['coffee', 'espresso', 'latte', 'cappuccino', 'cold-brew', 'specialty'],
        required: true 
      },
      image: { type: String, required: true },
      images: [{ type: String }],
      inStock: { type: Boolean, default: true },
      stockQuantity: { type: Number, default: 0 },
      featured: { type: Boolean, default: false },
      rating: { type: Number, default: 0 },
      reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true },
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }]
    }, { timestamps: true });

    // User Schema
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    }, { timestamps: true });

    // Order Schema
    const orderSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }],
      totalAmount: { type: Number, required: true },
      status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending' 
      },
      shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      },
      paymentMethod: String,
      paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending' 
      }
    }, { timestamps: true });

    Product = mongoose.model('Product', productSchema);
    User = mongoose.model('User', userSchema);
    Order = mongoose.model('Order', orderSchema);
  }
}

// Database operations
const db = {
  // Connect to MongoDB
  async connect() {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri || !mongoose) {
      console.log('📝 No MONGODB_URI found or MongoDB not available - using in-memory storage');
      return false;
    }

    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB successfully!');
      initializeModels();
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('📝 Falling back to in-memory storage');
      return false;
    }
  },

  // Get products
  async getProducts() {
    if (Product) {
      return await Product.find();
    }
    return memoryStore.products;
  },

  // Get product by ID
  async getProductById(id) {
    if (Product) {
      return await Product.findById(id);
    }
    return memoryStore.products.find(p => p._id === id);
  },

  // Create product
  async createProduct(productData) {
    if (Product) {
      const product = new Product(productData);
      return await product.save();
    }
    const product = { _id: `mem-${Date.now()}`, ...productData };
    memoryStore.products.push(product);
    return product;
  },

  // Update product
  async updateProduct(id, updateData) {
    if (Product) {
      return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }
    const index = memoryStore.products.findIndex(p => p._id === id);
    if (index !== -1) {
      memoryStore.products[index] = { ...memoryStore.products[index], ...updateData };
      return memoryStore.products[index];
    }
    return null;
  },

  // Delete product
  async deleteProduct(id) {
    if (Product) {
      return await Product.findByIdAndDelete(id);
    }
    const index = memoryStore.products.findIndex(p => p._id === id);
    if (index !== -1) {
      return memoryStore.products.splice(index, 1)[0];
    }
    return null;
  },

  // Get users
  async getUsers() {
    if (User) {
      return await User.find();
    }
    return memoryStore.users;
  },

  // Get user by ID
  async getUserById(id) {
    if (User) {
      return await User.findById(id);
    }
    return memoryStore.users.find(u => u._id === id);
  },

  // Get user by email
  async getUserByEmail(email) {
    if (User) {
      return await User.findOne({ email });
    }
    return memoryStore.users.find(u => u.email === email);
  },

  // Create user
  async createUser(userData) {
    if (User) {
      const user = new User(userData);
      return await user.save();
    }
    // In-memory: ensure password is hashed
    let password = userData.password;
    const isBcryptHash = typeof password === 'string' && password.startsWith('$2') && password.length >= 59;
    if (password && !isBcryptHash) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }
    const user = { _id: `mem-${Date.now()}`, ...userData, password };
    memoryStore.users.push(user);
    return user;
  },

  // Get orders
  async getOrders() {
    if (Order) {
      return await Order.find().populate('user').populate('items.product');
    }
    return memoryStore.orders;
  },

  // Get orders by user
  async getOrdersByUser(userId) {
    if (Order) {
      return await Order.find({ user: userId }).populate('items.product');
    }
    return memoryStore.orders.filter(o => o.user === userId);
  },

  // Create order
  async createOrder(orderData) {
    if (Order) {
      const order = new Order(orderData);
      return await order.save();
    }
    const order = { _id: `mem-${Date.now()}`, ...orderData };
    memoryStore.orders.push(order);
    return order;
  },

  // Seed sample data
  async seedData() {
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
      }
    ];

    if (Product) {
      // Clear existing products
      await Product.deleteMany({});
      // Insert sample products
      await Product.insertMany(sampleProducts);
      console.log(`✅ Seeded ${sampleProducts.length} products to MongoDB`);
    } else {
      // Use in-memory storage
      memoryStore.products = sampleProducts.map((p, i) => ({ 
        _id: `mem-${i + 1}`, 
        ...p 
      }));
      console.log(`✅ Seeded ${sampleProducts.length} products to memory store`);
    }
  }
};

module.exports = db;
