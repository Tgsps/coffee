import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [errors, setErrors] = useState({});
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'United States',
    paymentMethod: 'stripe',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States'
  });

  const steps = [
    { id: 'cart', label: 'Cart', completed: true },
    { id: 'information', label: 'Information', completed: true },
    { id: 'shipping', label: 'Shipping', completed: true },
    { id: 'payment', label: 'Payment', completed: false, current: true },
    { id: 'complete', label: 'Complete', completed: false }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (formData.paymentMethod === 'stripe') {
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCVV.trim() || formData.cardCVV.length < 3) {
        newErrors.cardCVV = 'Valid CVV is required';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, cardExpiry: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: formData.name,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        ...(couponCode && { couponCode })
      };

      const response = await api.post('/api/orders', orderData);
      
      clearCart();
      setShowConfirmation(true);
      
      setTimeout(() => {
        toast.success('Order placed successfully!');
        navigate(`/orders/${response.data._id}`);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const discount = couponCode ? subtotal * 0.1 : 0; // 10% discount for demo
  const total = subtotal + shipping + tax - discount;

  const getDeliveryEstimate = () => {
    const days = shipping === 0 ? 3 : 5;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-charcoal-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step.completed
                        ? 'bg-gold-400 text-charcoal-900'
                        : step.current
                        ? 'bg-white text-charcoal-900 ring-4 ring-gold-400/50'
                        : 'bg-charcoal-800 border-2 border-charcoal-700 text-white/40'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      step.completed || step.current ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      step.completed ? 'bg-gold-400' : 'bg-charcoal-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-12 text-center">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    required
                    className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                      focused === 'name'
                        ? 'border-gold-400 ring-2 ring-gold-400/50'
                        : errors.name
                        ? 'border-rose-400 ring-2 ring-rose-400/50'
                        : 'border-charcoal-700 hover:border-charcoal-600'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-rose-400">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    required
                    className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                      focused === 'email'
                        ? 'border-gold-400 ring-2 ring-gold-400/50'
                        : errors.email
                        ? 'border-rose-400 ring-2 ring-rose-400/50'
                        : 'border-charcoal-700 hover:border-charcoal-600'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-rose-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                    focused === 'phone'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-5 h-5 rounded border-charcoal-700 bg-charcoal-900 text-gold-400 focus:ring-gold-400"
                  />
                  <span className="ml-3 text-white/70 text-sm">
                    Save this information for next time
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6">
                Shipping Address
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('street')}
                  onBlur={() => setFocused('')}
                  required
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                    focused === 'street'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : errors.street
                      ? 'border-rose-400 ring-2 ring-rose-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-rose-400">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onFocus={() => setFocused('city')}
                    onBlur={() => setFocused('')}
                    required
                    className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                      focused === 'city'
                        ? 'border-gold-400 ring-2 ring-gold-400/50'
                        : errors.city
                        ? 'border-rose-400 ring-2 ring-rose-400/50'
                        : 'border-charcoal-700 hover:border-charcoal-600'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-rose-400">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    onFocus={() => setFocused('state')}
                    onBlur={() => setFocused('')}
                    required
                    className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                      focused === 'state'
                        ? 'border-gold-400 ring-2 ring-gold-400/50'
                        : errors.state
                        ? 'border-rose-400 ring-2 ring-rose-400/50'
                        : 'border-charcoal-700 hover:border-charcoal-600'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-rose-400">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onFocus={() => setFocused('zipCode')}
                    onBlur={() => setFocused('')}
                    required
                    className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                      focused === 'zipCode'
                        ? 'border-gold-400 ring-2 ring-gold-400/50'
                        : errors.zipCode
                        ? 'border-rose-400 ring-2 ring-rose-400/50'
                        : 'border-charcoal-700 hover:border-charcoal-600'
                    }`}
                    placeholder="12345"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-rose-400">{errors.zipCode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  onFocus={() => setFocused('country')}
                  onBlur={() => setFocused('')}
                  required
                  className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white transition-all ${
                    focused === 'country'
                      ? 'border-gold-400 ring-2 ring-gold-400/50'
                      : 'border-charcoal-700 hover:border-charcoal-600'
                  }`}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Italy">Italy</option>
                  <option value="Spain">Spain</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6">
                Payment Details
              </h2>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 bg-charcoal-900 border border-charcoal-700 rounded-lg cursor-pointer hover:border-charcoal-600 transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={formData.paymentMethod === 'stripe'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-gold-400 focus:ring-gold-400"
                  />
                  <span className="ml-3 text-white">Credit/Debit Card</span>
                  <div className="ml-auto flex gap-2">
                    <span className="text-xs text-white/40">VISA</span>
                    <span className="text-xs text-white/40">MC</span>
                  </div>
                </label>
                <label className="flex items-center p-4 bg-charcoal-900 border border-charcoal-700 rounded-lg cursor-pointer hover:border-charcoal-600 transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-gold-400 focus:ring-gold-400"
                  />
                  <span className="ml-3 text-white">PayPal</span>
                </label>
                <label className="flex items-center p-4 bg-charcoal-900 border border-charcoal-700 rounded-lg cursor-pointer hover:border-charcoal-600 transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-gold-400 focus:ring-gold-400"
                  />
                  <span className="ml-3 text-white">Cash on Delivery</span>
                </label>
              </div>

              {formData.paymentMethod === 'stripe' && (
                <div className="space-y-6 pt-6 border-t border-charcoal-700">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      onFocus={() => setFocused('cardNumber')}
                      onBlur={() => setFocused('')}
                      maxLength={19}
                      required
                      className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                        focused === 'cardNumber'
                          ? 'border-gold-400 ring-2 ring-gold-400/50'
                          : errors.cardNumber
                          ? 'border-rose-400 ring-2 ring-rose-400/50'
                          : 'border-charcoal-700 hover:border-charcoal-600'
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-rose-400">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-3">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleCardExpiryChange}
                        onFocus={() => setFocused('cardExpiry')}
                        onBlur={() => setFocused('')}
                        maxLength={5}
                        required
                        className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                          focused === 'cardExpiry'
                            ? 'border-gold-400 ring-2 ring-gold-400/50'
                            : errors.cardExpiry
                            ? 'border-rose-400 ring-2 ring-rose-400/50'
                            : 'border-charcoal-700 hover:border-charcoal-600'
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.cardExpiry && (
                        <p className="mt-1 text-sm text-rose-400">{errors.cardExpiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-3">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cardCVV"
                        value={formData.cardCVV}
                        onChange={handleInputChange}
                        onFocus={() => setFocused('cardCVV')}
                        onBlur={() => setFocused('')}
                        maxLength={4}
                        required
                        className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                          focused === 'cardCVV'
                            ? 'border-gold-400 ring-2 ring-gold-400/50'
                            : errors.cardCVV
                            ? 'border-rose-400 ring-2 ring-rose-400/50'
                            : 'border-charcoal-700 hover:border-charcoal-600'
                        }`}
                        placeholder="123"
                      />
                      {errors.cardCVV && (
                        <p className="mt-1 text-sm text-rose-400">{errors.cardCVV}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      onFocus={() => setFocused('cardName')}
                      onBlur={() => setFocused('')}
                      required
                      className={`w-full px-4 py-4 bg-charcoal-900 border rounded-lg text-white placeholder-white/40 transition-all ${
                        focused === 'cardName'
                          ? 'border-gold-400 ring-2 ring-gold-400/50'
                          : errors.cardName
                          ? 'border-rose-400 ring-2 ring-rose-400/50'
                          : 'border-charcoal-700 hover:border-charcoal-600'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-rose-400">{errors.cardName}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="w-5 h-5 rounded border-charcoal-700 bg-charcoal-900 text-gold-400 focus:ring-gold-400"
                  />
                  <span className="ml-3 text-white/70 text-sm">
                    Billing address same as shipping
                  </span>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            {/* Mobile Accordion Button */}
            <button
              type="button"
              onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
              className="lg:hidden w-full bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 mb-4 flex items-center justify-between"
            >
              <span className="text-xl font-serif font-bold text-white">Order Summary</span>
              <svg
                className={`w-6 h-6 text-white transition-transform ${orderSummaryOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 lg:p-8 sticky top-8 ${
                orderSummaryOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6">
                Order Summary
              </h2>
              
              {/* Products List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-white/60">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6 pt-6 border-t border-charcoal-700">
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => couponCode && toast.success('Coupon applied!')}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="mb-6 pb-6 border-b border-charcoal-700 flex items-center text-sm text-white/60">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Estimated delivery: {getDeliveryEstimate()}</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Discount</span>
                    <span className="text-gold-400">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tax</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-charcoal-700 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Purchase Button */}
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full bg-gold-400 hover:bg-gold-300 text-charcoal-900 py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 mb-4"
              >
                {loading ? 'Processing...' : `Complete Purchase - $${total.toFixed(2)}`}
              </button>

              <Link
                to="/cart"
                className="block text-center text-white/60 hover:text-white transition-colors text-sm"
              >
                ← Back to Cart
              </Link>
            </motion.div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-12 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-10 h-10 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-3xl font-serif font-bold text-white mb-4">
                Order Placed!
              </h3>
              <p className="text-white/70 mb-8">
                Thank you for your purchase. Your order confirmation has been sent to your email.
              </p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-white text-charcoal-900 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all"
              >
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
