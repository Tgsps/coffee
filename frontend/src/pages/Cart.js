import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-lg text-white/60 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-charcoal-900 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-12">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl overflow-hidden">
              {items.map((item) => (
                <div key={item.product._id} className="p-6 border-b border-charcoal-700 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-white/60 text-sm mb-2">
                        {item.product.category}
                      </p>
                      <div className="text-lg font-bold text-gold-400">
                        ${item.product.price}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-charcoal-700 rounded-lg bg-charcoal-900">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-charcoal-700 text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="px-4 py-2 text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-charcoal-700 text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-6 bg-charcoal-900 border-t border-charcoal-700">
                <button
                  onClick={clearCart}
                  className="text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 sticky top-8">
              <h2 className="text-2xl font-serif font-semibold text-white mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span className="font-medium text-white">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Shipping</span>
                  <span className="font-medium text-white">
                    {getCartTotal() > 100 ? 'Free' : '$10.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tax</span>
                  <span className="font-medium text-white">${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-charcoal-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>
                      ${(getCartTotal() + (getCartTotal() > 100 ? 0 : 10) + (getCartTotal() * 0.1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <Link
                  to="/checkout"
                  className="w-full bg-white text-charcoal-900 py-4 rounded-full font-semibold hover:bg-white/90 transition-all text-center block hover:scale-105"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-white/60 text-center">
                    Please log in to continue with checkout
                  </p>
                  <Link
                    to="/login"
                    className="w-full bg-white text-charcoal-900 py-4 rounded-full font-semibold hover:bg-white/90 transition-all text-center block hover:scale-105"
                  >
                    Login to Checkout
                  </Link>
                </div>
              )}

              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
