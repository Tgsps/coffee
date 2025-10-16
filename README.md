# Coffee Shop Website

A modern, responsive coffee-selling website built with React, Node.js, and MongoDB. Features a clean, attractive UI with warm colors and a complete e-commerce experience.

## Features

### Frontend
- **Modern UI/UX**: Clean, responsive design with warm color scheme (brown, beige, gold)
- **Home Page**: Hero banner, featured products, and company highlights
- **Products Page**: Grid layout with filtering, sorting, and search functionality
- **Product Detail**: Individual product pages with reviews and ratings
- **Shopping Cart**: Add/remove items, quantity adjustment, and cart persistence
- **Checkout**: Complete order form with shipping and payment details
- **User Authentication**: Login, registration, and profile management
- **Order Management**: View order history and order details
- **About & Contact**: Company information and contact forms

### Backend
- **RESTful APIs**: Complete CRUD operations for products, users, and orders
- **Authentication**: JWT-based user authentication and authorization
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing, input validation, and error handling
- **Order Management**: Complete order processing and tracking

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- React Toastify
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- Express Validator

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/coffee-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Quick Start (Both Services)

From the root directory, you can install all dependencies and start both services:

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/pay` - Update order payment status
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Admin only)

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  images: [String],
  inStock: Boolean,
  stockQuantity: Number,
  featured: Boolean,
  rating: Number,
  reviews: [{
    user: ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  user: ObjectId,
  orderItems: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  paymentResult: Object,
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Features in Detail

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

### User Experience
- Smooth page transitions
- Loading states and error handling
- Toast notifications
- Form validation
- Persistent cart and user sessions

### Security
- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes
- CORS configuration

### Performance
- Optimized images
- Lazy loading
- Efficient state management
- Minimal re-renders

## Customization

### Colors
The color scheme can be customized in `frontend/tailwind.config.js`:
- Coffee colors: Various shades of brown
- Gold colors: Accent colors for highlights
- Beige colors: Background and neutral tones

### Fonts
- Primary: Inter (sans-serif)
- Headings: Playfair Display (serif)

### Adding New Features
1. Create new components in `frontend/src/components/`
2. Add new pages in `frontend/src/pages/`
3. Create new API routes in `backend/routes/`
4. Add new database models in `backend/models/`

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update the `MONGODB_URI` in your environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Set up environment variables in your hosting platform

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Update the `REACT_APP_API_URL` to point to your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact us at info@coffeeshop.com or create an issue in the repository.

---

Built with ❤️ and ☕
