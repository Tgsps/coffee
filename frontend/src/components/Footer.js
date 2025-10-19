import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-coffee-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                <span className="text-coffee-800 font-bold text-lg">☕</span>
              </div>
              <span className="font-serif text-xl font-bold">CoffeeShop</span>
            </div>
            <p className="text-beige-300 mb-4 max-w-md">
              We're passionate about bringing you the finest coffee beans from around the world. 
              Every cup tells a story of quality, tradition, and exceptional taste.
            </p>
            <div className="flex space-x-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/21.cafe.ps/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-beige-300 hover:text-gold-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7z"></path>
                  <path d="M12 7a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6z"></path>
                  <circle cx="17.5" cy="6.5" r="1.2"></circle>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/21caferasaljura/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-beige-300 hover:text-gold-300 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              {/* Google Maps */}
              <a
                href="https://maps.app.goo.gl/5ZLCyBTP2ynEyKP98"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps"
                className="text-beige-300 hover:text-gold-300 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C7.589 2 4 5.589 4 10c0 5.25 6.47 11.32 7.02 11.85a1.389 1.389 0 001.96 0C13.53 21.32 20 15.25 20 10c0-4.411-3.589-8-8-8zm0 18.24C9.88 18.12 6 13.76 6 10a6 6 0 1112 0c0 3.76-3.88 8.12-6 10.24z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-beige-300 hover:text-gold-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-beige-300 hover:text-gold-300 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-beige-300 hover:text-gold-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-beige-300 hover:text-gold-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-beige-300">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Ein Sara, Hebron, Palestine</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+905010642319</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@coffeeshop.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-coffee-700 mt-8 pt-8 text-center text-beige-300">
          <p>&copy; 2024 CoffeeShop. All rights reserved. Made with ☕ and ❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
