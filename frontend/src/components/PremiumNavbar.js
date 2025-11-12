import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PremiumNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-charcoal-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              21<img src="https://i.ibb.co/bgndCPCv/72818780-d3ba-4367-b620-58e55790f53d.png" alt="coffee icon" className="inline-block w-5 h-5 mx-1 align-middle" />coffee
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#story"
              className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
            >
              Story
            </a>
            <a
              href="#products"
              className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
            >
              Products
            </a>
            <a
              href="#process"
              className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
            >
              Process
            </a>
            <a
              href="#shop"
              className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
            >
              Shop
            </a>
          </div>

          {/* Right side - Cart and Auth */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-white/90 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6">
            <div className="flex flex-col space-y-4 pt-4 border-t border-white/10">
              <a
                href="#story"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Story
              </a>
              <a
                href="#products"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </a>
              <a
                href="#process"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Process
              </a>
              <a
                href="#shop"
                className="text-white/90 hover:text-white transition-colors text-sm tracking-wide uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </a>
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

export default PremiumNavbar;

