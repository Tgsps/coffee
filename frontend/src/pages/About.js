import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  const milestones = [
    { year: '2020', title: 'Founded', description: 'Started with a passion for exceptional coffee' },
    { year: '2021', title: 'First Roastery', description: 'Opened our first roasting facility' },
    { year: '2022', title: 'Direct Trade', description: 'Established direct relationships with farmers' },
    { year: '2024', title: 'Premium Online', description: 'Launched premium online store' },
  ];

  const team = [
    { name: 'Alex Rodriguez', role: 'Head Roaster', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { name: 'Sarah Johnson', role: 'Quality Manager', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
    { name: 'Miguel Santos', role: 'Sourcing Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-charcoal-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&h=1080&fit=crop"
          alt="Coffee beans"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/80 to-charcoal-900/40" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Crafting Excellence, One Cup at a Time
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              Precision roasting, transparent sourcing, exceptional coffee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
                Our Story
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed text-lg">
                <p>
                  Founded with a simple mission: to share our love for exceptional coffee with the world.
                  We believe that great coffee starts with great beans—carefully selected, roasted to
                  perfection, and delivered fresh.
                </p>
                <p>
                  We work directly with farmers and cooperatives worldwide to source the finest,
                  most sustainable coffee beans. Our commitment to quality, sustainability, and
                  community drives everything we do.
                </p>
                <p>
                  We're not just selling coffee—we're sharing a lifestyle, a passion, and a connection
                  to coffee cultures around the world.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=1000&fit=crop"
                alt="Coffee roasting"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 bg-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Milestones that shaped who we are today
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-gold-400 via-rose-400 to-earth-400 opacity-30 hidden md:block" />

            <div className="space-y-16 md:space-y-24">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className={`flex items-center ${
                    idx % 2 === 0 ? 'flex-row md:flex-row' : 'flex-row-reverse md:flex-row-reverse'
                  }`}
                >
                  <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'pr-8 md:pr-16' : 'pl-8 md:pl-16'}`}>
                    <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl p-8">
                      <div className="text-gold-400 font-serif text-3xl font-bold mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-serif font-semibold text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-white/70">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-charcoal-900 z-10 hidden md:block" />

                  <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'pl-8 md:pl-16' : 'pr-8 md:pr-16'}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '✓', title: 'Quality First', desc: 'We never compromise on quality. Every product is carefully selected and tested.' },
              { icon: '🌱', title: 'Sustainability', desc: 'Committed to sustainable practices from sourcing to packaging.' },
              { icon: '🤝', title: 'Community', desc: 'Building strong relationships with customers, suppliers, and communities.' },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8"
              >
                <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-white/70 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              The passionate people behind ONYX who make it all possible
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="text-center bg-charcoal-900 border border-charcoal-700 rounded-2xl overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-gold-400 font-medium mb-3">{member.role}</p>
                  <p className="text-white/60 text-sm">
                    With years of experience ensuring excellence in every aspect of our operations.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              Ready to Experience Great Coffee?
            </h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Join thousands of coffee lovers who trust us for their daily brew
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-charcoal-900 px-10 py-5 rounded-full font-semibold hover:bg-white/95 transition-all hover:scale-105 text-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white/60 text-white px-10 py-5 rounded-full font-semibold hover:bg-white/10 transition-all text-lg"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
