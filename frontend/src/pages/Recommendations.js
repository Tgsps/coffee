import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const quizSteps = [
  {
    id: 'brew',
    title: 'How do you usually brew?',
    subtitle: 'We will lean toward profiles that shine with your gear.',
    options: [
      { value: 'pour-over', label: 'Pour Over / V60', categories: ['coffee', 'specialty'] },
      { value: 'espresso', label: 'Espresso Machine', categories: ['espresso'] },
      { value: 'immersion', label: 'French Press / AeroPress', categories: ['coffee', 'cold-brew'] },
      { value: 'milk', label: 'Milk Drinks', categories: ['latte', 'cappuccino'] }
    ]
  },
  {
    id: 'flavor',
    title: 'Pick a flavor direction',
    subtitle: 'We match descriptive keywords from our tasting notes.',
    options: [
      { value: 'bright', label: 'Bright & Fruity' },
      { value: 'chocolate', label: 'Chocolate & Caramel' },
      { value: 'spice', label: 'Spice & Earthy' },
      { value: 'balanced', label: 'Balanced & Familiar' }
    ]
  },
  {
    id: 'intensity',
    title: 'Preferred intensity',
    subtitle: 'Helps us select body and roast level.',
    options: [
      { value: 'delicate', label: 'Delicate' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'bold', label: 'Bold' }
    ]
  },
  {
    id: 'caffeine',
    title: 'Caffeine level',
    subtitle: 'Let us know if you want to stay mellow.',
    options: [
      { value: 'regular', label: 'Regular', categories: [] },
      { value: 'half', label: 'Half Caf', categories: [] },
      { value: 'decaf', label: 'Decaf', categories: [] }
    ]
  }
];

const flavorKeywords = {
  bright: ['citrus', 'berry', 'floral', 'tropical', 'vibrant'],
  chocolate: ['chocolate', 'cocoa', 'caramel', 'toffee', 'hazelnut'],
  spice: ['spice', 'spicy', 'cinnamon', 'nutmeg', 'clove', 'smoke'],
  balanced: ['balanced', 'sweet', 'classic', 'smooth', 'comfort']
};

const intensityHints = {
  delicate: ['tea-like', 'delicate', 'floral', 'gentle'],
  balanced: ['balanced', 'rounded', 'medium'],
  bold: ['bold', 'rich', 'syrupy', 'dense', 'intense']
};

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({
    brew: 'pour-over',
    flavor: 'bright',
    intensity: 'balanced',
    caffeine: 'regular'
  });
  const [activeStep, setActiveStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await api.get('/api/products?limit=100');
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const goToStep = (index) => {
    setActiveStep(Math.min(Math.max(index, 0), quizSteps.length - 1));
  };

  const handleSelect = (questionId, optionValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionValue }));
    const currentIndex = quizSteps.findIndex((q) => q.id === questionId);
    if (currentIndex < quizSteps.length - 1) {
      setTimeout(() => goToStep(currentIndex + 1), 250);
    }
  };

  const revealResults = () => {
    setShowResults(true);
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const scoredProducts = useMemo(() => {
    if (!products.length) return [];
    return products
      .map((product) => {
        let score = 0;
        const description = product.description?.toLowerCase() || '';
        const brewPref = quizSteps[0].options.find((opt) => opt.value === answers.brew);
        if (brewPref && brewPref.categories.includes(product.category)) {
          score += 3;
        }
        const flavorHints = flavorKeywords[answers.flavor] || [];
        if (flavorHints.some((word) => description.includes(word))) {
          score += 2;
        }
        const intensityWords = intensityHints[answers.intensity] || [];
        if (intensityWords.some((word) => description.includes(word))) {
          score += 1.5;
        }
        if (answers.intensity === 'bold' && ['espresso', 'cold-brew'].includes(product.category)) {
          score += 1;
        }
        if (answers.intensity === 'delicate' && ['specialty', 'coffee'].includes(product.category)) {
          score += 1;
        }
        if (answers.caffeine === 'decaf' && description.includes('decaf')) {
          score += 3;
        }
        if (answers.caffeine !== 'decaf' && !description.includes('decaf')) {
          score += 0.5;
        }
        score += (product.rating || 4.5) * 0.2;
        return { ...product, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [products, answers]);

  const topRecommendations = scoredProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-charcoal-900 text-white">
      <section className="py-20 bg-gradient-to-b from-charcoal-900 via-charcoal-900/80 to-charcoal-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Find Your Coffee</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">
            Find your perfect coffee companion
          </h1>
          <p className="text-lg md:text-xl text-white/70">
            Answer a handful of simple questions and we will narrow the menu to the coffees that match your ritual.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm uppercase tracking-widest text-white/50">
            {quizSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`px-4 py-2 rounded-full border ${
                  index === activeStep ? 'border-white text-white' : 'border-white/20'
                }`}
              >
                {index + 1}. {step.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {quizSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: index === activeStep ? 1 : 0.4, y: 0 }}
              className={`bg-charcoal-800 border rounded-2xl p-6 md:p-8 transition-all cursor-pointer ${
                index === activeStep
                  ? 'border-gold-400 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                  : 'border-charcoal-700'
              }`}
              onClick={() => goToStep(index)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                  <p className="text-white/50 text-sm uppercase tracking-[0.3em] mb-2">
                    Step {index + 1}
                  </p>
                  <h2 className="text-2xl font-serif font-semibold">{step.title}</h2>
                  <p className="text-white/60 text-sm">{step.subtitle}</p>
                </div>
                <p className="text-white/60 text-sm">
                  Your pick: <span className="text-white">{answers[step.id]}</span>
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {step.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(step.id, option.value);
                    }}
                    className={`text-left px-5 py-4 rounded-xl border transition-all ${
                      answers[step.id] === option.value
                        ? 'border-gold-400 bg-gold-400/10 text-white'
                        : 'border-white/10 text-white/80 hover:border-white/40'
                    }`}
                  >
                    <p className="font-semibold">{option.label}</p>
                    {option.note && <p className="text-sm text-white/60">{option.note}</p>}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-white/60 text-sm uppercase tracking-[0.3em]">Ready for your matches?</p>
          <p className="text-white/70 text-base md:text-lg">
            Work through the questions above, then let us crunch the answers to surface beans that fit you best.
          </p>
          <button
            onClick={revealResults}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-charcoal-900 font-semibold tracking-wide hover:bg-white/90 transition-all"
          >
            Show My Recommendations
          </button>
        </div>
      </section>

      <section className="py-20 bg-charcoal-800/40" ref={resultsRef}>
        {showResults ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Recommended</p>
                <h3 className="text-3xl font-serif font-semibold">
                  Tailored picks selected just for you
                </h3>
                <p className="text-white/60">
                  Answer a few quick questions and we will surface coffees that match your brewing style and mood.
                </p>
              </div>
              <Link
                to="/products"
                className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-semibold"
              >
                Browse complete menu
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {topRecommendations.length === 0 && (
                  <div className="col-span-3 text-center text-white/70">
                    We could not find an exact match. Try tweaking your answers or explore the full catalog.
                  </div>
                )}
                {topRecommendations.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-charcoal-900 border border-charcoal-700 rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col gap-4 flex-1">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-white/50">{product.category}</p>
                        <h4 className="text-2xl font-serif font-semibold">{product.name}</h4>
                      </div>
                      <p className="text-white/70 text-sm flex-1">{product.description}</p>
                      <p className="text-3xl font-bold">${product.price}</p>
                      <div className="flex gap-3">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 text-center border-2 border-white/20 text-white py-3 rounded-full hover:bg-white/10 transition-all text-sm font-medium"
                        >
                          See details
                        </Link>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="flex-1 bg-white text-charcoal-900 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white/60">
            <p>
              Once you are satisfied with your answers, tap "Show My Recommendations" to generate personalized coffee picks.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Recommendations;
