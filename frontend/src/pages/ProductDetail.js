import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useCompare } from '../context/CompareContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { selectedProducts, toggleProduct, isSelected, maxCompare } = useCompare();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleCompareAction = () => {
    const wasSelected = isSelected(product._id);
    if (!wasSelected && selectedProducts.length >= maxCompare) {
      toast.info(`You can compare up to ${maxCompare} products.`);
      return;
    }
    toggleProduct(product);
    toast.success(
      wasSelected
        ? 'Removed from comparison'
        : `Added to compare (${selectedProducts.length + 1}/${maxCompare})`
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/api/products/${id}/reviews`, review);
      setReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
      fetchProduct();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-charcoal-900 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ol className="flex items-center space-x-2 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li>/</li>
            <li className="text-white font-medium">{product.name}</li>
          </ol>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-charcoal-700">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${i < Math.floor(product.rating || 5) ? 'text-gold-400' : 'text-charcoal-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white/60">
                  ({product.reviews?.length || 0} reviews)
                </span>
                <span className="px-3 py-1 bg-charcoal-800 border border-charcoal-700 text-white/60 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <p className="text-xl text-white/70 leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-8">
                <span className="text-5xl font-bold text-white">
                  ${product.price}
                </span>
                {product.inStock ? (
                  <span className="px-4 py-2 bg-gold-400/20 text-gold-400 border border-gold-400/30 rounded-full text-sm font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="px-4 py-2 bg-rose-400/20 text-rose-400 border border-rose-400/30 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6">
              <label className="block text-sm font-medium text-white/90 mb-4">
                Quantity
              </label>
              <div className="flex items-center border border-charcoal-700 rounded-lg w-40 bg-charcoal-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-charcoal-700 text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-6 py-3 text-white font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-charcoal-700 text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-white text-charcoal-900 py-5 rounded-full font-bold text-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleCompareAction}
                className="w-full mt-4 border border-white/20 text-white py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                {isSelected(product._id) ? 'Remove from comparison' : 'Add to comparison'}
              </button>

              <div className="flex items-center justify-center gap-8 text-sm text-white/60 pt-4 border-t border-charcoal-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13h14M5 17h14m-4-4v4m0 0l-4-4m4 4l4-4M3 21l9-9 9 9" />
                  </svg>
                  <span>Free shipping over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-16 border-t border-charcoal-700"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-12">
            Customer Reviews
          </h2>

          {/* Add Review Form */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 mb-12"
            >
              <h3 className="text-xl font-serif font-semibold text-white mb-6">
                Write a Review
              </h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview(prev => ({ ...prev, rating: star }))}
                        className={`w-10 h-10 transition-all ${
                          star <= review.rating ? 'text-gold-400 scale-110' : 'text-charcoal-600 hover:text-charcoal-500'
                        }`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Comment
                  </label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-4 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all resize-none"
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-gold-400 hover:bg-gold-300 text-charcoal-900 px-8 py-4 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {product.reviews?.length === 0 ? (
              <div className="text-center py-12 bg-charcoal-800 border border-charcoal-700 rounded-2xl">
                <p className="text-white/60">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            ) : (
              product.reviews?.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center border border-gold-400/30">
                        <span className="text-gold-400 font-bold text-lg">
                          {review.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {review.user?.name || 'Anonymous'}
                        </div>
                        <div className="flex text-gold-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-gold-400' : 'text-charcoal-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-white/60">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-white/70 leading-relaxed">{review.comment}</p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ProductDetail;
