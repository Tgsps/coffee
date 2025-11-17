import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-charcoal-900 text-white shadow-lg border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">21coffee</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase">
              Home
            </Link>
            <Link to="/products" className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase">
              Products
            </Link>
            <Link to="/recommendations" className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase">
              Find Your Coffee
            </Link>
            <Link to="/compare" className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase">
              Compare
            </Link>
            <Link to="/about" className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase">
              About
            </Link>
            <Link to="/guides" className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase">
              Guides
            </Link>
            <Link to="/contact" className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase">
              Contact
            </Link>
          </div>

          {/* Right side - Cart and Auth */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-white/90 hover:text-white transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M6 9V7.8a6 6 0 1112 0V9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M5 9h14a1 1 0 011 1v9a3 3 0 01-3 3H7a3 3 0 01-3-3v-9a1 1 0 011-1z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 13h6"
                />
              </svg>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-400 text-charcoal-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-charcoal-900/95 backdrop-blur-md rounded-lg shadow-xl py-2 z-50 border border-charcoal-700">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-charcoal-800"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-charcoal-800"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-charcoal-800"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-charcoal-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full font-medium transition-all border border-white/30 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/90 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6">
            <div className="flex flex-col space-y-4 pt-4 border-t border-white/10">
              <Link
                to="/"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/recommendations"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Your Coffee
              </Link>
              <Link
                to="/compare"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
              <Link
                to="/about"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/guides"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Guides
              </Link>
              <Link
                to="/contact"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-white/90 hover:text-white transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full font-medium transition-all border border-white/30 text-sm text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
