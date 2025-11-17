import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { toast } from 'react-toastify';

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
  const { selectedProducts, toggleProduct, isSelected, maxCompare, removeProduct, clearProducts } = useCompare();

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

  const handleCompareToggle = (product) => {
    if (!isSelected(product._id) && selectedProducts.length >= maxCompare) {
      toast.info(`You can compare up to ${maxCompare} products.`);
      return;
    }
    toggleProduct(product);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flavor profile colors mapping
  const getFlavorColor = (index) => {
    const colors = [
      { bg: 'bg-rose-400', border: 'border-rose-400' }, // Fruity/Berry notes
      { bg: 'bg-earth-400', border: 'border-earth-400' }, // Nutty/Earthy notes
      { bg: 'bg-gold-400', border: 'border-gold-400' }, // Caramel/Chocolate notes
      { bg: 'bg-rose-300', border: 'border-rose-300' }, // Floral notes
      { bg: 'bg-earth-300', border: 'border-earth-300' }, // Spice notes
      { bg: 'bg-gold-300', border: 'border-gold-300' }, // Sweet notes
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white mb-6">
            Our Coffee Collection
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium coffee, crafted for discerning tastes
          </p>
        </motion.div>
        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-between items-center mb-10">
          <div className="text-white/60 text-sm">
            Need help choosing? جرّب الاختبار أو قارن حتى ثلاثة منتجات.
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/recommendations"
              className="px-5 py-3 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Take the quiz
            </Link>
            <Link
              to={selectedProducts.length > 0 ? `/compare?ids=${selectedProducts.map((p) => p._id).join(',')}` : '/compare'}
              className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-all"
            >
              Compare products
            </Link>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors"
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
              <label className="block text-sm font-medium text-white/90 mb-2">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors"
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
              <div className="text-sm text-white/60">
                Showing {products.length} of {pagination.total} products
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compare Tray */}
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-5 mb-10"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-white/60 uppercase tracking-[0.3em]">Compare Tray</p>
                <p className="text-white">Selected {selectedProducts.length}/{maxCompare} products</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-charcoal-900 border border-white/10 text-sm"
                  >
                    <span>{product.name}</span>
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="text-white/60 hover:text-white text-xs"
                    >
                      A-
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/compare?ids=${selectedProducts.map((p) => p._id).join(',')}`}
                  className={`px-5 py-2 rounded-full text-sm font-semibold ${
                    selectedProducts.length >= 2
                      ? 'bg-white text-charcoal-900 hover:bg-white/90 transition-all'
                      : 'bg-white/10 text-white/60 cursor-not-allowed'
                  }`}
                >
                  View comparison
                </Link>
                <button
                  onClick={clearProducts}
                  className="px-5 py-2 rounded-full border border-white/20 text-white/70 hover:text-white text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">☕</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-white/60">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
              >
                {products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 hover:border-charcoal-600 transition-all group"
                  >
                    <Link to={`/products/${product._id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCompareToggle(product);
                          }}
                          className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                            isSelected(product._id)
                              ? 'bg-white text-charcoal-900'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {isSelected(product._id) ? 'Selected' : 'Compare'}
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className={`absolute top-4 right-4 w-16 h-16 rounded-full ${getFlavorColor(idx).bg} opacity-80 backdrop-blur-sm border-2 border-white/30`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link to={`/products/${product._id}`}>
                        <h3 className="text-2xl font-serif font-semibold text-white mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-white/60 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold text-white">
                          ${product.price}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 5)
                                  ? 'text-gold-400'
                                  : 'text-charcoal-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 text-center border-2 border-white/20 text-white py-3 rounded-full hover:bg-white/10 transition-all text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="flex-1 bg-white text-charcoal-900 py-3 rounded-full hover:bg-white/90 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
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
                  className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        page === pagination.currentPage
                          ? 'bg-white text-charcoal-900'
                          : 'border border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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