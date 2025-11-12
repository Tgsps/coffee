import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\+?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <span className="font-serif text-4xl font-bold text-white block mb-2">21<img src="https://chatgpt.com/backend-api/estuary/content?id=file_000000005f70722f920329d14b0b9d1f&ts=489706&p=fs&cid=1&sig=1e23edf10017fdc6c1828b924490f588f7e2a7cec794a0f694c5c874ed54f854&v=0" alt="coffee icon" className="inline-block w-6 h-6 mx-2 align-middle" />coffee</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Create Your Account
          </h2>
          <p className="text-white/60">
            Join our coffee community and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-rose-400/20 border border-rose-400/30 text-rose-400 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-3">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                    focused === 'name'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : errors.name
                      ? 'border-rose-400 ring-2 ring-rose-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-rose-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                    focused === 'email'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : errors.email
                      ? 'border-rose-400 ring-2 ring-rose-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-rose-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-3">
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                    focused === 'phone'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : errors.phone
                      ? 'border-rose-400 ring-2 ring-rose-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-rose-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-3">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                    focused === 'password'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : errors.password
                      ? 'border-rose-400 ring-2 ring-rose-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-rose-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-3">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                    focused === 'confirmPassword'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : errors.confirmPassword
                      ? 'border-rose-400 ring-2 ring-rose-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-rose-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-start mt-6">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-5 h-5 rounded border-charcoal-700 bg-charcoal-900 text-gold-400 focus:ring-gold-400 mt-1"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-white/70">
                I agree to the{' '}
                <button type="button" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-400 hover:bg-gold-300 text-charcoal-900 py-4 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 mt-8"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
