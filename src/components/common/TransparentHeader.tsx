import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Crown, Settings, User, Menu, X } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const TransparentHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { subscription } = useSubscription();

  // Pages that need solid header background
  const solidHeaderPages = ['/studio', '/curation', '/visionboard', '/upgrade', '/account'];
  const needsSolidHeader = solidHeaderPages.some(path => location.pathname.startsWith(path));

  // Check scroll position on mount and add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    // Check initial scroll position
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logo click based on authentication status
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/studio');
    } else {
      navigate('/');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  // Handle upgrade button click
  const handleUpgradeClick = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/upgrade');
  };

  // Handle account settings navigation
  const handleAccountClick = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/account');
  };

  // Get plan display name based on subscription tier
  const getPlanDisplayName = () => {
    switch (subscription.tier) {
      case 'studio':
        return 'Studio Plan';
      case 'pro':
        return 'Pro Plan';
      default:
        return 'Free Plan';
    }
  };

  // Get plan color based on subscription tier
  const getPlanColor = () => {
    switch (subscription.tier) {
      case 'studio':
        return 'bg-blue-100 text-blue-700';
      case 'pro':
        return 'bg-violet-100 text-violet-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Determine text color based on scroll state and page
  const getTextColor = () => {
    return (isScrolled || needsSolidHeader) ? 'text-slate-900' : 'text-white';
  };

  // Determine secondary text color based on scroll state and page
  const getTextColorSecondary = () => {
    return (isScrolled || needsSolidHeader) ? 'text-slate-700' : 'text-white/90';
  };

  // Determine hover background based on scroll state and page
  const getHoverBg = () => {
    return (isScrolled || needsSolidHeader) ? 'rgba(148, 163, 184, 0.1)' : 'rgba(255, 255, 255, 0.15)';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-500">
      {/* Background with conditional styling */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled || needsSolidHeader 
            ? 'bg-white/95 backdrop-blur-[20px] saturate-[1.8] border-b border-slate-200/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)]' 
            : 'bg-transparent'
        }`}
        style={{
          // Fallback for browsers that don't support backdrop-filter
          backgroundColor: !CSS?.supports?.('backdrop-filter', 'blur(20px)') && (isScrolled || needsSolidHeader)
            ? 'rgba(255, 255, 255, 0.98)' 
            : undefined
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo with MDI text */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group"
          >
            {/* Logo SVG */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 32 32" className="w-full h-full">
                {/* Main circles */}
                <circle cx="10" cy="10" r="6" fill="#8b5cf6" />
                <circle cx="22" cy="10" r="6" fill="#3b82f6" />
                <circle cx="10" cy="22" r="6" fill="#7c3aed" />
                <circle cx="22" cy="22" r="6" fill="#475569" />
              </svg>
            </div>
            
            {/* MDI text with conditional color */}
            <span className={`font-semibold text-2xl ${getTextColor()}`}>
              MDI
            </span>
          </button>

          {/* Desktop Navigation - Removed */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation links removed as requested */}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                {/* User Avatar Button */}
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300`}
                  style={{
                    background: isUserMenuOpen ? getHoverBg() : 'transparent'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={(e) => {
                    if (!isUserMenuOpen) {
                      e.currentTarget.style.background = getHoverBg();
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUserMenuOpen) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className={`font-medium text-sm ${getTextColorSecondary()} hidden sm:block`}>
                    {user?.user_metadata?.first_name || 'User'}
                  </span>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl py-2 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-slate-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                            </p>
                            <p className="text-sm text-slate-600 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Status */}
                      <div className="px-4 py-3 border-b border-slate-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Subscription</span>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPlanColor()}`}>
                            {getPlanDisplayName()}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          to="/account" 
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={handleAccountClick}
                        >
                          <Settings size={16} />
                          <span className="text-sm font-medium">Account Settings</span>
                        </Link>

                        {subscription.tier === 'free' && (
                          <Link 
                            to="/upgrade" 
                            className="flex items-center gap-3 px-4 py-2.5 text-violet-600 hover:bg-violet-50 transition-colors"
                            onClick={handleUpgradeClick}
                          >
                            <Crown size={16} />
                            <div>
                              <span className="text-sm font-medium">Upgrade Plan</span>
                              <p className="text-xs text-slate-500">Want to remove ads?</p>
                            </div>
                          </Link>
                        )}

                        <button 
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <LogOut size={16} />
                          <span className="text-sm font-medium">
                            {isLoggingOut ? 'Signing out...' : 'Sign out'}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to="/signin" 
                  className="relative inline-flex items-center justify-center px-6 py-2.5 font-medium text-sm transition-all duration-300 rounded-full overflow-hidden text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                  style={{ minWidth: '120px', textAlign: 'center' }}
                >
                  Get started
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-full transition-all duration-300`}
                style={{
                  background: isMobileMenuOpen ? getHoverBg() : 'transparent'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className={`h-5 w-5 ${getTextColor()}`} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className={`h-5 w-5 ${getTextColor()}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 z-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-4 bg-slate-100/60 rounded-2xl mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                    </p>
                    <p className="text-sm text-slate-600">{user?.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/account"
                      className="flex items-center justify-between font-medium text-slate-700 hover:text-slate-900 py-4 px-4 rounded-2xl transition-all duration-300 group bg-white/60 hover:bg-white/80"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Settings size={18} />
                        <span className="text-lg">Account Settings</span>
                      </div>
                      <motion.div
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-slate-600"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>

                    <Link 
                      to="/upgrade"
                      className="flex items-center justify-between font-medium text-violet-600 hover:text-violet-700 py-4 px-4 rounded-2xl transition-all duration-300 group bg-violet-50/60 hover:bg-violet-100/60 w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Crown size={18} />
                        <span className="text-lg">Upgrade Plan</span>
                      </div>
                      <motion.div
                        className="w-1.5 h-1.5 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-violet-600"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>

                    <div className="py-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                    </div>

                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block w-full text-center py-4 px-6 font-medium text-red-600 hover:text-red-700 rounded-2xl transition-all duration-300 bg-white/60 hover:bg-red-50/80"
                    >
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <Link 
                      to="/signin" 
                      className="block w-full text-center py-4 px-6 font-medium text-slate-700 hover:text-slate-900 rounded-2xl transition-all duration-300 bg-white/60 hover:bg-white/80"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    
                    <Link 
                      to="/signup" 
                      className="block w-full text-center py-4 px-6 font-medium rounded-2xl transition-all duration-300 text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TransparentHeader;