import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(from, { replace: true });
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
          <span className="font-serif text-4xl font-bold text-white block mb-2"><img src="https://i.ibb.co/dJmPXPpg/56d73b99-dfea-4ab2-965d-249ec3dd4a2d.png" alt="brand icon" className="inline-block w-8 h-8 mx-2 align-middle" referrerPolicy="no-referrer" /></span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Welcome Back
          </h2>
          <p className="text-white/60">
            Sign in to your account to continue shopping
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
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-3">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-rose-400">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <label className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-5 h-5 rounded border-charcoal-700 bg-charcoal-900 text-gold-400 focus:ring-gold-400"
                />
                <span className="ml-3 block text-sm text-white/70">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-400 hover:bg-gold-300 text-charcoal-900 py-4 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 mt-8"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Sign up here
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

export default Login;
