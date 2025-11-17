import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const brewGuides = [
  {
    id: 'v60',
    title: 'V60 Pour Over',
    ratio: '1:16 (18g coffee / 290g water)',
    time: '3:00 - 3:30 minutes',
    description:
      'Bright, clean, and layered cup that highlights the origin character. Perfect for single-origin beans.',
    steps: [
      'Rinse filter and preheat the dripper',
      'Bloom with 45g water for 45 seconds',
      'Pulse pour remaining water in circles, keeping bed level',
      'Swirl gently before final drawdown'
    ]
  },
  {
    id: 'french-press',
    title: 'French Press',
    ratio: '1:14 (30g coffee / 420g water)',
    time: '4:00 minutes',
    description:
      'Full-bodied brew with heavy sweetness and texture. Accentuates chocolate and nutty profiles.',
    steps: [
      'Add coarse coffee and pour water to cover',
      'Stir gently, then fill to the top',
      'Steep 4 minutes, skim the crust',
      'Press slowly and serve immediately'
    ]
  },
  {
    id: 'espresso',
    title: 'Modern Espresso',
    ratio: '1:2 (18g in / 36g out)',
    time: '28 - 32 seconds',
    description:
      'Dense syrupy shot designed for milk drinks or sipping straight. Dialed for sweetness and clarity.',
    steps: [
      'Purge group head and dry basket',
      'Distribute evenly and tamp level',
      'Start shot, aim for 9 bars of pressure',
      'Stop at 36g, adjust grind for time window'
    ]
  }
];

const brewTips = [
  { title: 'Water Temperature', detail: '92°C - 94°C keeps sweetness without harshness' },
  { title: 'Grind Consistency', detail: 'Use a burr grinder and adjust based on drawdown time' },
  { title: 'Water Quality', detail: 'Aim for 70-120 ppm total hardness for balanced extraction' },
  { title: 'Rested Coffee', detail: 'Brew beans 5-14 days off roast for optimal flavor' }
];

const Guides = () => {
  return (
    <div className="bg-charcoal-900 text-white min-h-screen">
      <section className="bg-gradient-to-b from-charcoal-900 via-charcoal-900/80 to-charcoal-900 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Brew Guides</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">
            Craft café-level coffee at home
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Step-by-step brewing recipes tuned to our signature coffees. Precision ratios,
            curated gear, and sensory tips that bring the barista ritual to your counter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-4 rounded-full bg-white text-charcoal-900 font-semibold hover:bg-white/90 transition-all"
            >
              Shop the Beans
            </Link>
            <a
              href="#guides"
              className="px-8 py-4 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
            >
              Explore Methods
            </a>
          </div>
        </div>
      </section>

      <section id="guides" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {brewGuides.map((guide, idx) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 flex flex-col space-y-4 hover:border-charcoal-600 transition-all"
              >
                <div>
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-2">Method</p>
                  <h2 className="text-2xl font-serif font-semibold">{guide.title}</h2>
                </div>
                <div className="space-y-2 text-white/70 text-sm">
                  <p><span className="text-white">Ratio:</span> {guide.ratio}</p>
                  <p><span className="text-white">Brew Time:</span> {guide.time}</p>
                </div>
                <p className="text-white/70 text-sm leading-relaxed flex-1">{guide.description}</p>
                <div className="space-y-3">
                  {guide.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm">
                        {stepIdx + 1}
                      </span>
                      <p className="text-sm text-white/80">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-charcoal-800/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-4">Brew Science</p>
            <h3 className="text-3xl font-serif font-semibold mb-2">Water, grind, and motion</h3>
            <p className="text-white/70 mb-6">
              Extraction lives at the intersection of water quality, grind size, and pouring
              intent. Adjust just one variable at a time and log your brews to dial in sweetness.
            </p>
            <div className="space-y-4">
              {brewTips.map((tip, index) => (
                <div key={tip.title} className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{tip.title}</p>
                    <p className="text-white/70 text-sm">{tip.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-4">Recommended Tools</p>
            <h3 className="text-3xl font-serif font-semibold mb-6">Build your brew bar</h3>
            <div className="space-y-4 text-white/70">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <p>Grinder</p>
                <p className="text-white">64mm burr, stepless</p>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <p>Scale</p>
                <p className="text-white">0.1g accuracy, timer</p>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <p>Kettle</p>
                <p className="text-white">Gooseneck, temp control</p>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <p>Water</p>
                <p className="text-white">90-100 ppm mineral kit</p>
              </div>
              <div className="flex justify-between">
                <p>Journal</p>
                <p className="text-white">Track doses & ratios</p>
              </div>
            </div>
            <div className="mt-8 p-4 rounded-xl bg-charcoal-900 border border-white/10">
              <p className="text-sm text-white/60">
                Want a personal brew consult? Drop us a note and we’ll tailor a recipe to your coffee
                bar setup.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center mt-4 text-gold-400 font-semibold hover:text-gold-300"
              >
                Contact our baristas →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Guides;
