import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/api/products?featured=true&limit=3');
        setFeaturedProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Hero Section - full-bleed image with subtle parallax and soft overlay */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1920&auto=format&fit=crop"
            alt="Craft coffee in warm light"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-black/10" />

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-14">
            <div className="text-left">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-sm"
              >
                Modern Coffee Atelier
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
                className="mt-4 text-lg md:text-2xl text-white/80 max-w-2xl"
              >
                Single-origin lots and signature blends, roasted with intention.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                className="mt-8 flex items-center gap-4"
              >
                <Link
                  to="/products"
                  className="inline-block rounded-xl bg-white text-black px-6 py-3 text-base font-semibold tracking-wide hover:bg-white/90 transition-colors"
                >
                  Explore Our Coffee
                </Link>
                <Link
                  to="/about"
                  className="inline-block rounded-xl border border-white/60 text-white px-6 py-3 text-base font-semibold tracking-wide hover:bg-white/10 transition-colors"
                >
                  Our Philosophy
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About / Philosophy - editorial block with image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop"
                alt="Roasting craft"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-beige-900">Our Philosophy</h2>
              <p className="mt-6 text-beige-600 leading-relaxed">
                We approach coffee as artisans—sourcing responsibly, roasting with intention, and
                honoring the unique character of each origin. The result is a refined cup that
                balances clarity, sweetness, and texture.
              </p>
              <Link to="/about" className="mt-8 inline-block text-beige-900 underline underline-offset-4 decoration-beige-400 hover:decoration-beige-900 transition-colors">
                Learn more about our craft
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - refined grid with micro animations */}
      <section className="py-20 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-beige-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated coffee selections
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-700"></div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {featuredProducts.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 * idx }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl overflow-hidden bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] transition-all"
                  >
                    <Link to={`/products/${product._id}`}>
                      <div className="relative aspect-[4/3]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link to={`/products/${product._id}`}>
                        <h3 className="text-xl font-serif font-semibold text-beige-900 tracking-tight hover:text-coffee-700 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-2 text-beige-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-2xl font-bold text-coffee-800">${product.price}</span>
                        <div className="flex items-center">
                          <div className="flex text-gold-500">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-gold-500' : 'text-beige-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-beige-600">
                            ({product.reviews?.length || 0})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-5 w-full rounded-xl bg-black text-white py-3 font-semibold tracking-wide hover:bg-neutral-900 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block rounded-xl border border-beige-300 text-beige-900 hover:bg-beige-100 px-6 py-3 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Sustainability / Craft - mixed photography and copy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 order-2 md:order-1">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-beige-900">Sourcing with Integrity</h2>
              <p className="mt-6 text-beige-600 leading-relaxed">
                We partner directly with producers and pay quality premiums to ensure
                sustainability across the supply chain. Transparency and craft guide every decision.
              </p>
              <div className="mt-8 h-px w-24 bg-beige-300" />
            </div>
          </div>
          <div className="md:col-span-5 order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1502325966718-85a90488dc29?q=80&w=1200&auto=format&fit=crop"
                alt="Sourcing at origin"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Subscribe to our newsletter for the latest coffee news and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button className="bg-white hover:bg-white/90 text-black font-semibold py-3 px-6 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
