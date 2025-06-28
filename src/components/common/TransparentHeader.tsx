import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Crown, Settings, User, Menu, X } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const TransparentHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoColorStates] = useState([0, 1, 2, 3]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { subscription } = useSubscription();

  // Updated color gradients
  const colorGradients = [
    { id: 'gradient1', colors: ['#8b5cf6', '#a855f7'] }, // Violet
    { id: 'gradient2', colors: ['#3b82f6', '#2563eb'] }, // Blue
    { id: 'gradient3', colors: ['#7c3aed', '#6d28d9'] }, // Purple
    { id: 'gradient4', colors: ['#10b981', '#059669'] }, // Green
  ];

  // Pages that need solid header background
  const solidHeaderPages = ['/studio', '/curation', '/visionboard', '/upgrade', '/account'];
  const needsSolidHeader = solidHeaderPages.some(path => location.pathname.startsWith(path));

  // Enhanced scroll handler with hiding functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolled = currentScrollY > 30;
      setIsScrolled(scrolled);

      // Hide header when scrolling down beyond 50px, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Check initial scroll position
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
        return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-700';
      case 'pro':
        return 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-700';
      default:
        return 'bg-gradient-to-r from-slate-500/10 to-gray-500/10 border-slate-500/20 text-slate-700';
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
    <header 
      className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ease-out"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Background with conditional styling */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled || needsSolidHeader 
            ? 'bg-white/20 backdrop-blur-[20px] saturate-[1.8] border-b border-slate-200/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)]' 
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
          {/* Logo and APP_NAME - shows only when scrolled or on solid pages */}
          {(isScrolled || needsSolidHeader) && (
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-4 group"
            >
              {/* Four-Circle Logo with animations */}
              <motion.div 
                className="relative w-10 h-10 flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
              >
                <svg width="40" height="40" viewBox="0 0 32 32" className="w-full h-full">
                  {/* Enhanced Glow effects behind each circle */}
                  <motion.circle 
                    cx="10" 
                    cy="10" 
                    r="10" 
                    fill="rgba(139, 92, 246, 0.2)"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0 * 0.6
                    }}
                  />
                  <motion.circle 
                    cx="22" 
                    cy="10" 
                    r="10" 
                    fill="rgba(59, 130, 246, 0.2)"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1 * 0.6
                    }}
                  />
                  <motion.circle 
                    cx="10" 
                    cy="22" 
                    r="10" 
                    fill="rgba(124, 58, 237, 0.2)"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2 * 0.6
                    }}
                  />
                  <motion.circle 
                    cx="22" 
                    cy="22" 
                    r="10" 
                    fill="rgba(16, 185, 129, 0.2)"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 3 * 0.6
                    }}
                  />

                  {/* Main circles on top */}
                  <motion.circle 
                    cx="10" 
                    cy="10" 
                    r="6" 
                    fill={`url(#${colorGradients[logoColorStates[0]].id})`}
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={{ 
                      scale: 1,
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      scale: { delay: 0.1, type: "spring", stiffness: 400, damping: 17 },
                      opacity: { 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0 * 0.6
                      }
                    }}
                  />
                  <motion.circle 
                    cx="22" 
                    cy="10" 
                    r="6" 
                    fill={`url(#${colorGradients[logoColorStates[1]].id})`}
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={{ 
                      scale: 1,
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      scale: { delay: 0.2, type: "spring", stiffness: 400, damping: 17 },
                      opacity: { 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1 * 0.6
                      }
                    }}
                  />
                  <motion.circle 
                    cx="10" 
                    cy="22" 
                    r="6" 
                    fill={`url(#${colorGradients[logoColorStates[2]].id})`}
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={{ 
                      scale: 1,
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      scale: { delay: 0.3, type: "spring", stiffness: 400, damping: 17 },
                      opacity: { 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2 * 0.6
                      }
                    }}
                  />
                  <motion.circle 
                    cx="22" 
                    cy="22" 
                    r="6" 
                    fill={`url(#${colorGradients[logoColorStates[3]].id})`}
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={{ 
                      scale: 1,
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      scale: { delay: 0.4, type: "spring", stiffness: 400, damping: 17 },
                      opacity: { 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3 * 0.6
                      }
                    }}
                  />
                  
                  {/* All gradient definitions */}
                  <defs>
                    {colorGradients.map((gradient) => (
                      <linearGradient 
                        key={gradient.id}
                        id={gradient.id} 
                        x1="0%" 
                        y1="0%" 
                        x2="100%" 
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={gradient.colors[0]} />
                        <stop offset="100%" stopColor={gradient.colors[1]} />
                      </linearGradient>
                    ))}
                  </defs>
                </svg>
              </motion.div>

              {/* APP_NAME */}
              <motion.h2 
                className="font-[900] text-3xl text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                {APP_NAME}
              </motion.h2>
            </button>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
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

                {/* Enhanced User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-6 w-96 bg-white/95 backdrop-blur-2xl border border-slate-200/40 rounded-3xl shadow-2xl shadow-slate-900/10 py-2 z-50 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                    >
                      {/* Enhanced gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-slate-50/80 rounded-3xl pointer-events-none"></div>
                      
                      {/* Header section */}
                      <div className="relative z-10 px-6 py-4 border-b border-slate-200/40">
                        <div className="flex items-center gap-4">
                          {/* Enhanced avatar with glow effect */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-2xl blur-sm"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-lg truncate">
                              {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                            </p>
                            <p className="text-sm text-slate-600 truncate font-medium">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Subscription Status */}
                      <div className="relative z-10 px-6 py-4 border-b border-slate-200/40">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-700 mb-1">Current Plan</p>
                            <p className="text-xs text-slate-500">Manage your subscription</p>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${getPlanColor()}`}>
                            {getPlanDisplayName()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Account Settings button */}
                      <motion.button 
                        onClick={handleAccountClick}
                        className="relative z-10 group w-full px-6 py-4 text-left transition-all duration-300"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-slate-50/60 to-slate-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl mx-2"
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors mb-1">
                                Account Settings
                              </p>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                Manage your profile and preferences
                              </p>
                            </div>
                            <motion.div
                              className="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-slate-600"
                              initial={{ scale: 0.8 }}
                              whileHover={{ scale: 1.2 }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                      </motion.button>

                      {/* Enhanced Upgrade button for free users */}
                      {subscription.tier === 'free' && (
                        <motion.button 
                          onClick={handleUpgradeClick}
                          className="relative z-10 group w-full px-6 py-4 text-left transition-all duration-300"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-50/80 to-purple-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl mx-2"
                          />
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-violet-700 group-hover:text-violet-800 transition-colors mb-1">
                                  Upgrade Plan
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  Remove ads and unlock premium features
                                </p>
                              </div>
                              <div className="relative">
                                <div className="px-2 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold rounded-full">
                                  PRO
                                </div>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      )}
                      
                      {/* Divider */}
                      <div className="border-t border-slate-200/40 mt-2 pt-2">
                        {/* Enhanced Sign out button */}
                        <motion.button 
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="relative z-10 group w-full px-6 py-4 text-left transition-all duration-300 disabled:opacity-50 rounded-b-3xl"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-50/80 to-rose-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl mx-2"
                          />
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-red-600 group-hover:text-red-700 transition-colors mb-1">
                                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {isLoggingOut ? 'Please wait...' : 'End your current session'}
                                </p>
                              </div>
                              {isLoggingOut && (
                                <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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

      {/* Enhanced Mobile Menu */}
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
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm rounded-2xl mb-6 border border-slate-200/40">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-2xl blur-sm"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-lg">
                      {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">{user?.email}</p>
                    <div className={`inline-block mt-2 px-2 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${getPlanColor()}`}>
                      {getPlanDisplayName()}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/account"
                      className="flex items-center justify-between font-semibold text-slate-700 hover:text-slate-900 py-4 px-6 rounded-2xl transition-all duration-300 group bg-white/80 hover:bg-white border border-slate-200/40 hover:border-slate-300/60"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div>
                        <p className="text-lg mb-1">Account Settings</p>
                        <p className="text-xs text-slate-500 font-normal">Manage your profile and preferences</p>
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
                      className="flex items-center justify-between font-semibold text-violet-600 hover:text-violet-700 py-4 px-6 rounded-2xl transition-all duration-300 group bg-gradient-to-r from-violet-50/80 to-purple-50/80 border border-violet-200/40 hover:border-violet-300/60"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div>
                        <p className="text-lg mb-1">Upgrade Plan</p>
                        <p className="text-xs text-slate-500 font-normal">Remove ads and unlock premium features</p>
                      </div>
                      <div className="relative">
                        <div className="px-2 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold rounded-full">
                          PRO
                        </div>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                      </div>
                    </Link>

                    <div className="py-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                    </div>

                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center justify-between w-full font-semibold text-red-600 hover:text-red-700 py-4 px-6 rounded-2xl transition-all duration-300 group bg-gradient-to-r from-red-50/80 to-rose-50/80 border border-red-200/40 hover:border-red-300/60 disabled:opacity-50"
                    >
                      <div>
                        <p className="text-lg mb-1">{isLoggingOut ? 'Signing out...' : 'Sign Out'}</p>
                        <p className="text-xs text-slate-500 font-normal">{isLoggingOut ? 'Please wait...' : 'End your current session'}</p>
                      </div>
                      {isLoggingOut && (
                        <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                      )}
                    </button>
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