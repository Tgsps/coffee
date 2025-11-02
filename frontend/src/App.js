import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PremiumNavbar from './components/PremiumNavbar';
import PremiumFooter from './components/PremiumFooter';

// Pages
import PremiumHome from './pages/PremiumHome';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layout components
const PremiumLayout = ({ children }) => (
  <div className="min-h-screen bg-charcoal-900">
    <PremiumNavbar />
    <main className="min-h-screen">{children}</main>
    <PremiumFooter />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
);

const StandardLayout = ({ children }) => (
  <div className="min-h-screen bg-charcoal-900">
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Premium home page route */}
            <Route
              path="/"
              element={
                <PremiumLayout>
                  <PremiumHome />
                </PremiumLayout>
              }
            />
            {/* Other routes with standard layout */}
            <Route
              path="/products"
              element={
                <StandardLayout>
                  <Products />
                </StandardLayout>
              }
            />
            <Route
              path="/products/:id"
              element={
                <StandardLayout>
                  <ProductDetail />
                </StandardLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <StandardLayout>
                  <Cart />
                </StandardLayout>
              }
            />
            <Route
              path="/about"
              element={
                <StandardLayout>
                  <About />
                </StandardLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <StandardLayout>
                  <Contact />
                </StandardLayout>
              }
            />
            <Route
              path="/login"
              element={
                <StandardLayout>
                  <Login />
                </StandardLayout>
              }
            />
            <Route
              path="/register"
              element={
                <StandardLayout>
                  <Register />
                </StandardLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <StandardLayout>
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                </StandardLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <StandardLayout>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </StandardLayout>
              }
            />
            <Route
              path="/orders"
              element={
                <StandardLayout>
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                </StandardLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <StandardLayout>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </StandardLayout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <StandardLayout>
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                </StandardLayout>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <StandardLayout>
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                </StandardLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <StandardLayout>
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                </StandardLayout>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <StandardLayout>
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                </StandardLayout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
