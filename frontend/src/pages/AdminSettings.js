import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    account: {
      name: 'Admin User',
      email: 'admin@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    preferences: {
      darkMode: true,
      notifications: true,
      emailNotifications: true
    },
    system: {
      siteTitle: '21coffee Coffee Lab',
      currency: 'USD',
      timezone: 'America/New_York'
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = (section) => {
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
  };

  const tabs = [
    { id: 'account', label: 'Account Settings', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'system', label: 'System Settings', icon: '🔧' }
  ];

  return (
    <div className="min-h-screen bg-charcoal-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-charcoal-800 border-r border-charcoal-700 min-h-screen p-6"
        >
          <Link to="/admin" className="block mb-8">
            <span className="text-2xl font-serif font-bold text-white">← Dashboard</span>
          </Link>
          
          <nav className="space-y-2">
            <Link
              to="/admin"
              className="block px-4 py-3 text-white/60 hover:text-white hover:bg-charcoal-700 rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="block px-4 py-3 text-white/60 hover:text-white hover:bg-charcoal-700 rounded-lg transition-all"
            >
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="block px-4 py-3 text-white/60 hover:text-white hover:bg-charcoal-700 rounded-lg transition-all"
            >
              Orders
            </Link>
            <Link
              to="/admin/users"
              className="block px-4 py-3 text-white/60 hover:text-white hover:bg-charcoal-700 rounded-lg transition-all"
            >
              Users
            </Link>
            <Link
              to="/admin/settings"
              className="block px-4 py-3 text-gold-400 bg-gold-400/10 border-l-4 border-gold-400 rounded-lg font-semibold"
            >
              Settings
            </Link>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 py-12 px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
              Settings
            </h1>
            <p className="text-white/60 mb-8">Manage your account and system preferences</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-charcoal-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-gold-400 border-b-2 border-gold-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 space-y-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-white mb-6">Account Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.account.name}
                      onChange={(e) => handleInputChange('account', 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.account.email}
                      onChange={(e) => handleInputChange('account', 'email', e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                    />
                  </div>

                  <div className="pt-4 border-t border-charcoal-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={formData.account.currentPassword}
                          onChange={(e) => handleInputChange('account', 'currentPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={formData.account.newPassword}
                          onChange={(e) => handleInputChange('account', 'newPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={formData.account.confirmPassword}
                          onChange={(e) => handleInputChange('account', 'confirmPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave('account')}
                    className="w-full bg-gradient-to-r from-gold-400 to-rose-400 text-charcoal-900 py-4 rounded-full font-semibold hover:opacity-90 transition-all"
                  >
                    Save Changes
                  </button>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 space-y-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-white mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-charcoal-900 rounded-lg border border-charcoal-700">
                      <div>
                        <div className="font-medium text-white">Dark Mode</div>
                        <div className="text-sm text-white/60">Enable dark theme</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.darkMode}
                          onChange={(e) => handleInputChange('preferences', 'darkMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-charcoal-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-400"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-charcoal-900 rounded-lg border border-charcoal-700">
                      <div>
                        <div className="font-medium text-white">Notifications</div>
                        <div className="text-sm text-white/60">Enable browser notifications</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications}
                          onChange={(e) => handleInputChange('preferences', 'notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-charcoal-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-400"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-charcoal-900 rounded-lg border border-charcoal-700">
                      <div>
                        <div className="font-medium text-white">Email Notifications</div>
                        <div className="text-sm text-white/60">Receive email updates</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.emailNotifications}
                          onChange={(e) => handleInputChange('preferences', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-charcoal-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-400"></div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave('preferences')}
                    className="w-full bg-gradient-to-r from-gold-400 to-rose-400 text-charcoal-900 py-4 rounded-full font-semibold hover:opacity-90 transition-all"
                  >
                    Save Changes
                  </button>
                </motion.div>
              )}

              {activeTab === 'system' && (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 space-y-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-white mb-6">System Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      value={formData.system.siteTitle}
                      onChange={(e) => handleInputChange('system', 'siteTitle', e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.system.currency}
                      onChange={(e) => handleInputChange('system', 'currency', e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.system.timezone}
                      onChange={(e) => handleInputChange('system', 'timezone', e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleSave('system')}
                    className="w-full bg-gradient-to-r from-gold-400 to-rose-400 text-charcoal-900 py-4 rounded-full font-semibold hover:opacity-90 transition-all"
                  >
                    Save Changes
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

