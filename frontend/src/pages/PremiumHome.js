import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const PremiumHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products?limit=6');
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
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
      {/* Hero Section - Full width with parallax */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1920&auto=format&fit=crop"
            alt="Premium coffee experience"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/80 to-charcoal-900/40" />
        </motion.div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center md:text-left max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white mb-6 leading-tight"
            >
              DESIGN IN COFFEE.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed mb-10"
            >
              Single-origin lots, precision roasting, and transparent sourcing.
              Craft meets science in every cup.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#products"
                className="inline-block bg-white text-charcoal-900 px-8 py-4 text-lg font-semibold tracking-wide rounded-full hover:bg-white/95 transition-all hover:scale-105"
              >
                Explore Coffee
              </a>
              <a
                href="#story"
                className="inline-block border-2 border-white/60 text-white px-8 py-4 text-lg font-semibold tracking-wide rounded-full hover:bg-white/10 transition-all hover:border-white"
              >
                Our Story
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <SectionInView id="story">
        {(ref, inView) => (
          <section ref={ref} className="py-32 bg-charcoal-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="grid md:grid-cols-2 gap-16 items-center"
              >
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
                    Our Story
                  </h2>
                  <div className="space-y-6 text-white/70 leading-relaxed">
                    <p className="text-lg">
                      We approach coffee as a craft—sourcing single-origin lots
                      with precision, roasting with intention, and honoring the
                      unique character of each terroir.
                    </p>
                    <p className="text-lg">
                      Transparency drives our relationships with producers. We pay
                      quality premiums that ensure sustainability across the supply
                      chain, from farm to cup.
                    </p>
                    <p className="text-lg">
                      The result is a refined cup that balances clarity, sweetness,
                      and texture—coffee that tells a story.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="aspect-square overflow-hidden rounded-2xl"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop"
                      alt="Coffee origin"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="aspect-square overflow-hidden rounded-2xl"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop"
                      alt="Roasting process"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="aspect-square overflow-hidden rounded-2xl col-span-2"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1501339847302-ac426a4c7c13?q=80&w=800&auto=format&fit=crop"
                      alt="Brewing craft"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </SectionInView>

      {/* Products Section */}
      <SectionInView id="products">
        {(ref, inView) => (
          <section ref={ref} className="py-32 bg-charcoal-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
                  Our Offerings
                </h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  Each blend and single-origin is color-coded to reflect its unique
                  flavor profile
                </p>
              </motion.div>

              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 hover:border-charcoal-600 transition-all group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div
                          className={`absolute top-4 right-4 w-16 h-16 rounded-full ${getFlavorColor(idx).bg} opacity-80 backdrop-blur-sm border-2 border-white/30`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-serif font-semibold text-white mb-2">
                          {product.name}
                        </h3>
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
                            className="flex-1 bg-white text-charcoal-900 py-3 rounded-full hover:bg-white/90 transition-all text-sm font-semibold"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mt-16"
              >
                <Link
                  to="/products"
                  className="inline-block border-2 border-white/30 text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all hover:border-white/60 text-lg font-medium"
                >
                  View All Products
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </SectionInView>

      {/* Process / Behind The Scenes Section */}
      <SectionInView id="process">
        {(ref, inView) => (
          <section ref={ref} className="py-32 bg-charcoal-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
                  Behind The Scenes
                </h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  From origin to cup—our transparent approach to coffee
                </p>
              </motion.div>

              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-rose-400 via-earth-400 to-gold-400 opacity-30" />

                {/* Timeline items */}
                <div className="space-y-32">
                  {[
                    {
                      title: 'Origin',
                      description:
                        'Direct partnerships with producers. We visit farms, understand terroir, and select only the finest single-origin lots.',
                      image:
                        'https://images.unsplash.com/photo-1502325966718-85a90488dc29?q=80&w=1200&auto=format&fit=crop',
                      side: 'left',
                    },
                    {
                      title: 'Roasting',
                      description:
                        'Precision roasting profiles tailored to each lot. We test, refine, and document every curve for transparency.',
                      image:
                        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop',
                      side: 'right',
                    },
                    {
                      title: 'Brewing',
                      description:
                        'Lab-grade water chemistry, calibrated grind sizes, and precise extraction parameters. Science meets craft.',
                      image:
                        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
                      side: 'left',
                    },
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: step.side === 'left' ? -40 : 40 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8, delay: idx * 0.2 }}
                      className={`relative flex items-center ${
                        step.side === 'left' ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      {/* Content */}
                      <div
                        className={`w-full md:w-5/12 ${
                          step.side === 'left' ? 'pr-8 md:pr-16' : 'pl-8 md:pl-16'
                        }`}
                      >
                        <div className="bg-charcoal-800 rounded-2xl p-8 border border-charcoal-700">
                          <h3 className="text-3xl font-serif font-bold text-white mb-4">
                            {step.title}
                          </h3>
                          <p className="text-white/70 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Timeline dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-charcoal-900 z-10" />

                      {/* Image */}
                      <div
                        className={`w-full md:w-5/12 ${
                          step.side === 'left' ? 'pl-8 md:pl-16' : 'pr-8 md:pr-16'
                        }`}
                      >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </SectionInView>

      {/* Shop / Get Started CTA Section */}
      <SectionInView id="shop">
        {(ref, inView) => (
          <section ref={ref} className="py-32 bg-charcoal-800 relative overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1920&auto=format&fit=crop"
                alt="Coffee shop"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-charcoal-800/80" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
                  Ready to Experience Premium Coffee?
                </h2>
                <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of coffee enthusiasts who trust us for quality,
                  transparency, and exceptional flavor.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/products"
                    className="inline-block bg-white text-charcoal-900 px-10 py-5 text-lg font-semibold rounded-full hover:bg-white/95 transition-all hover:scale-105"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/register"
                    className="inline-block border-2 border-white/60 text-white px-10 py-5 text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </SectionInView>
    </div>
  );
};

// Helper component for scroll animations
const SectionInView = ({ id, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div id={id} ref={ref}>
      {children(ref, inView)}
    </div>
  );
};

export default PremiumHome;

