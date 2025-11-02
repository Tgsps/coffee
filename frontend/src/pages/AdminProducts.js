import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image: '',
    inStock: true,
    stockQuantity: 0,
    featured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data.products || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
        stockQuantity: typeof formData.stockQuantity === 'string' ? parseInt(formData.stockQuantity) : formData.stockQuantity,
        inStock: Boolean(formData.inStock),
        featured: Boolean(formData.featured)
      };

      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/api/products', payload);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      inStock: product.inStock !== false,
      stockQuantity: product.stockQuantity || 0,
      featured: product.featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'coffee',
      image: '',
      inStock: true,
      stockQuantity: 0,
      featured: false
    });
  };

  const categories = ['coffee', 'espresso', 'latte', 'cappuccino', 'cold-brew', 'specialty'];

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && product.inStock !== false) ||
      (stockFilter === 'out-of-stock' && product.inStock === false) ||
      (stockFilter === 'low-stock' && (product.stockQuantity || 0) > 0 && (product.stockQuantity || 0) < 10);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const stats = {
    total: products.length,
    outOfStock: products.filter(p => p.inStock === false).length,
    lowStock: products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10).length,
    topSelling: products
      .filter(p => p.featured)
      .slice(0, 3)
      .map(p => ({ name: p.name, price: p.price }))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                Products
              </h1>
              <p className="text-white/60">Manage your product inventory</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin"
                className="px-6 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-lg hover:bg-charcoal-700 transition-all"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gold-400 text-charcoal-900 rounded-lg font-semibold hover:bg-gold-300 transition-all"
              >
                Add Product
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Products Table */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-charcoal-700">
                  <thead className="bg-charcoal-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-charcoal-800 divide-y divide-charcoal-700">
                    {filteredProducts.map((product, idx) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-charcoal-700/50 transition-all group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded-lg border border-charcoal-700 group-hover:scale-105 transition-transform"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{product.name}</div>
                          <div className="text-xs text-white/60 truncate max-w-xs mt-1">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-charcoal-700 text-white/80 border border-charcoal-600">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                          ${product.price?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {product.stockQuantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.inStock === false ? (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-400/20 text-rose-400 border border-rose-400/30">
                              Out of Stock
                            </span>
                          ) : (product.stockQuantity || 0) < 10 && (product.stockQuantity || 0) > 0 ? (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gold-400/20 text-gold-400 border border-gold-400/30">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-earth-400/20 text-earth-400 border border-earth-400/30">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-gold-400 hover:text-gold-300 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-rose-400 hover:text-rose-300 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/60">No products found</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Quick Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 space-y-6 sticky top-8"
            >
              <h3 className="text-xl font-serif font-bold text-white mb-4">Quick Summary</h3>
              
              <div className="space-y-4">
                <div className="bg-charcoal-900 rounded-lg p-4 border border-charcoal-700">
                  <div className="text-sm text-white/60 mb-1">Total Products</div>
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                </div>
                
                <div className="bg-charcoal-900 rounded-lg p-4 border border-charcoal-700">
                  <div className="text-sm text-white/60 mb-1">Out of Stock</div>
                  <div className="text-2xl font-bold text-rose-400">{stats.outOfStock}</div>
                </div>
                
                <div className="bg-charcoal-900 rounded-lg p-4 border border-charcoal-700">
                  <div className="text-sm text-white/60 mb-1">Low Stock</div>
                  <div className="text-2xl font-bold text-gold-400">{stats.lowStock}</div>
                </div>
              </div>

              {stats.topSelling.length > 0 && (
                <div className="pt-4 border-t border-charcoal-700">
                  <h4 className="text-sm font-semibold text-white/90 mb-3">Top Selling</h4>
                  <div className="space-y-2">
                    {stats.topSelling.map((item, idx) => (
                      <div key={idx} className="text-sm text-white/70">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-white/50">${item.price?.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto"
              >
                <h2 className="text-3xl font-serif font-bold text-white mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all resize-none"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Image URL</label>
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) =>
                          setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })
                        }
                        className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                      />
                    </div>
                    <div className="flex items-center space-x-4 pt-8">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                          className="w-5 h-5 rounded border-charcoal-700 bg-charcoal-900 text-gold-400 focus:ring-gold-400"
                        />
                        <span className="ml-2 text-sm text-white/70">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 rounded border-charcoal-700 bg-charcoal-900 text-gold-400 focus:ring-gold-400"
                        />
                        <span className="ml-2 text-sm text-white/70">Featured</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="px-6 py-3 border border-charcoal-700 rounded-lg text-white hover:bg-charcoal-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gold-400 text-charcoal-900 rounded-lg font-semibold hover:bg-gold-300 transition-all"
                    >
                      {editingProduct ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminProducts;
