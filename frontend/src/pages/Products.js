import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const { addToCart } = useCart();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'espresso', label: 'Espresso' },
    { value: 'latte', label: 'Latte' },
    { value: 'cappuccino', label: 'Cappuccino' },
    { value: 'cold-brew', label: 'Cold Brew' },
    { value: 'specialty', label: 'Specialty' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...filters
      });

      const response = await api.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxe.matte to-luxe.espresso text-luxe.cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-luxe.cream drop-shadow-sm">
            Our Coffee Collection
          </h1>
          <p className="mt-3 text-base md:text-lg text-luxe.creamMuted/80 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium coffee, crafted for discerning tastes
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] p-6 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-luxe.cream mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field bg-white/10 border-white/10 text-luxe.cream placeholder-white/40"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-luxe.cream mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field bg-white/10 border-white/10 text-luxe.cream"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-luxe.cream mb-2">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field bg-white/10 border-white/10 text-luxe.cream"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-luxe.cream/70">
                Showing {products.length} of {pagination.total} products
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxe.gold"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">☕</div>
            <h3 className="text-xl font-semibold text-luxe.cream mb-2">
              No products found
            </h3>
            <p className="text-luxe.cream/70">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              >
                {products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.03 * idx }}
                    whileHover={{ scale: 1.02 }}
                    className="group rounded-2xl overflow-hidden backdrop-blur bg-white/5 border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_60px_-12px_rgba(201,162,39,0.35)] hover:border-luxe.gold/60 transition-all duration-300"
                  >
                  <Link to={`/products/${product._id}`}>
                      <div className="aspect-w-1 aspect-h-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                  </Link>
                    <div className="p-5">
                      <Link to={`/products/${product._id}`}>
                        <h3 className="text-lg font-serif font-semibold text-luxe.cream mb-2 tracking-tight group-hover:text-luxe.gold transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-luxe.cream/70 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-luxe.gold">
                          ${product.price}
                        </span>
                        <span className="text-xs bg-white/10 text-luxe.cream px-2 py-1 rounded-full border border-white/10">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex text-luxe.gold">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-luxe.gold' : 'text-white/20'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-luxe.cream/60">
                          ({product.reviews?.length || 0})
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full mt-4 py-2 rounded-xl bg-gradient-to-r from-luxe.gold to-luxe.goldSoft text-luxe.matte font-semibold tracking-wide hover:from-luxe.goldSoft hover:to-luxe.gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        page === pagination.currentPage
                          ? 'bg-coffee-700 text-white'
                          : 'border border-coffee-300 text-coffee-700 hover:bg-coffee-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
