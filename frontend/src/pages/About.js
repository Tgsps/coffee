import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-beige-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-coffee-800 to-coffee-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            About CoffeeShop
          </h1>
          <p className="text-xl text-beige-200 max-w-2xl mx-auto">
            We're passionate about bringing you the finest coffee experience, 
            one cup at a time.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-coffee-800 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-beige-700 mb-6">
                Founded in 2020, CoffeeShop began as a small family business with a simple mission: 
                to share our love for exceptional coffee with the world. What started as a passion 
                project has grown into a trusted destination for coffee enthusiasts everywhere.
              </p>
              <p className="text-lg text-beige-700 mb-6">
                We believe that great coffee starts with great beans. That's why we work directly 
                with farmers and cooperatives around the world to source the finest, most sustainable 
                coffee beans. Every bean is carefully selected, roasted to perfection, and delivered 
                fresh to your door.
              </p>
              <p className="text-lg text-beige-700">
                Our commitment to quality, sustainability, and community drives everything we do. 
                We're not just selling coffee – we're sharing a lifestyle, a passion, and a 
                connection to coffee cultures around the world.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Coffee beans"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-coffee-800 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-beige-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-coffee-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-beige-600 max-w-2xl mx-auto">
              These core principles guide everything we do and shape our commitment to you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-3">Quality First</h3>
              <p className="text-beige-600">
                We never compromise on quality. Every product we offer is carefully selected 
                and tested to meet our high standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-3">Sustainability</h3>
              <p className="text-beige-600">
                We're committed to sustainable practices, from sourcing to packaging, 
                to protect our planet for future generations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-3">Community</h3>
              <p className="text-beige-600">
                We believe in building strong relationships with our customers, 
                suppliers, and the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-coffee-800 mb-4">
              From Bean to Cup
            </h2>
            <p className="text-lg text-beige-600 max-w-2xl mx-auto">
              Discover the journey our coffee takes from farm to your morning cup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-coffee-800 mb-2">Sourcing</h3>
              <p className="text-beige-600 text-sm">
                We partner with sustainable farms worldwide to source the finest coffee beans
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-lg font-semibold text-coffee-800 mb-2">Roasting</h3>
              <p className="text-beige-600 text-sm">
                Our master roasters carefully roast each batch to bring out the perfect flavor profile
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-coffee-800 mb-2">Packaging</h3>
              <p className="text-beige-600 text-sm">
                Fresh coffee is carefully packaged to maintain quality and flavor during shipping
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">☕</span>
              </div>
              <h3 className="text-lg font-semibold text-coffee-800 mb-2">Enjoyment</h3>
              <p className="text-beige-600 text-sm">
                Delivered fresh to your door, ready to brew the perfect cup of coffee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-beige-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-coffee-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-beige-600 max-w-2xl mx-auto">
              The passionate people behind CoffeeShop who make it all possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-coffee-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-2">Alex Rodriguez</h3>
              <p className="text-gold-600 font-medium mb-2">Head Roaster</p>
              <p className="text-beige-600 text-sm">
                With over 15 years of experience, Alex ensures every bean is roasted to perfection
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-coffee-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👩‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-2">Sarah Johnson</h3>
              <p className="text-gold-600 font-medium mb-2">Quality Manager</p>
              <p className="text-beige-600 text-sm">
                Sarah oversees our quality control processes to maintain our high standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-coffee-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-2">Miguel Santos</h3>
              <p className="text-gold-600 font-medium mb-2">Sourcing Director</p>
              <p className="text-beige-600 text-sm">
                Miguel travels the world to find the best coffee beans and build lasting relationships
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-coffee-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Ready to Experience Great Coffee?
          </h2>
          <p className="text-xl text-beige-200 mb-8">
            Join thousands of coffee lovers who trust CoffeeShop for their daily brew
          </p>
          <div className="space-x-4">
            <a
              href="/products"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-coffee-800 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-coffee-800 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
