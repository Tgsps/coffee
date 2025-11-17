import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

const Compare = () => {
  const location = useLocation();
  const { selectedProducts, removeProduct, clearProducts } = useCompare();
  const { addToCart } = useCart();
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const queryIds = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const ids = params.get('ids');
    if (!ids) return null;
    return ids
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
  }, [location.search]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!queryIds || !queryIds.length) {
        setFetchedProducts([]);
        return;
      }
      setLoading(true);
      try {
        const responses = await Promise.all(
          queryIds.map((id) => api.get(`/api/products/${id}`))
        );
        setFetchedProducts(responses.map((res) => res.data));
      } catch (error) {
        console.error('Failed to load products for comparison', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [queryIds]);

  const activeProducts = queryIds && queryIds.length ? fetchedProducts : selectedProducts;

  const featureRows = [
    { label: 'Category', render: (product) => product.category || '—' },
    { label: 'Price', render: (product) => `$${product.price?.toFixed ? product.price.toFixed(2) : product.price}` },
    { label: 'Rating', render: (product) => `${product.rating || 4.5}/5` },
    { label: 'Stock', render: (product) => (product.inStock ? 'In stock' : 'Out of stock') },
    {
      label: 'Tasting Notes',
      render: (product) => product.description || '—'
    }
  ];

  const handleRemove = (id) => {
    if (queryIds && queryIds.length) {
      setFetchedProducts((prev) => prev.filter((product) => product._id !== id));
      return;
    }
    removeProduct(id);
  };

  const hasEnough = activeProducts.length >= 2;

  return (
    <div className="min-h-screen bg-charcoal-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Compare</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold">Product comparison</h1>
            <p className="text-white/60 mt-2">
              اختر حتى ثلاثة منتجات لمشاهدة الفروقات في السعر والمذاق والمواصفات.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-semibold"
            >
              أضف المزيد من المنتجات
            </Link>
            {!queryIds && selectedProducts.length > 0 && (
              <button
                onClick={clearProducts}
                className="px-5 py-3 rounded-full border border-white/20 text-white/70 hover:text-white transition-all text-sm"
              >
                تفريغ الاختيارات
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        ) : !hasEnough ? (
          <div className="text-center py-20 bg-charcoal-800 border border-charcoal-700 rounded-2xl">
            <h3 className="text-2xl font-serif font-semibold mb-3">اختر منتجين على الأقل</h3>
            <p className="text-white/60 mb-6">
              من صفحة المنتجات اضغط على زر "قارن" لإضافة حتى ثلاثة منتجات إلى هذه المقارنة.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-charcoal-900 font-semibold hover:bg-white/90 transition-all"
            >
              الذهاب للمنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {activeProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-charcoal-800 border border-charcoal-700 rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                          {product.category}
                        </p>
                        <h3 className="text-2xl font-serif font-semibold">{product.name}</h3>
                      </div>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="text-white/50 hover:text-white text-xs uppercase tracking-widest"
                      >
                        إزالة
                      </button>
                    </div>
                    <p className="text-3xl font-bold">${product.price}</p>
                    <p className="text-white/70 text-sm flex-1">{product.description}</p>
                    <div className="flex gap-3 pt-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="flex-1 text-center border border-white/20 text-white py-2 rounded-full hover:bg-white/10 transition-all text-sm"
                      >
                        التفاصيل
                      </Link>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 bg-white text-charcoal-900 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
                      >
                        للسلة
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl overflow-x-auto">
              <table className="min-w-full divide-y divide-charcoal-700">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/60">
                      الميزة
                    </th>
                    {activeProducts.map((product) => (
                      <th
                        key={product._id}
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/60"
                      >
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-700">
                  {featureRows.map((row) => (
                    <tr key={row.label}>
                      <td className="px-6 py-4 text-sm font-semibold text-white/70">{row.label}</td>
                      {activeProducts.map((product) => (
                        <td key={`${row.label}-${product._id}`} className="px-6 py-4 text-sm text-white">
                          {row.render(product)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Compare;
