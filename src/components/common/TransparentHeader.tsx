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
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [logoColorStates] = useState([0, 1, 2, 3]); // Static color states for each dot
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { subscription } = useSubscription();

  // Your original 4 color gradients
  const colorGradients = [
    { id: 'gradient1', colors: ['#8b5cf6', '#a855f7'] }, // Violet
    { id: 'gradient2', colors: ['#3b82f6', '#2563eb'] }, // Blue
    { id: 'gradient3', colors: ['#7c3aed', '#6d28d9'] }, // Purple
    { id: 'gradient4', colors: ['#475569', '#334155'] }, // Slate
  ];

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

  // Animation variants for letter effects
  const letterVariants = {
    initial: { 
      scale: 1,
      rotateY: 0,
      z: 0,
      filter: 'none'
    },
    hover: (i: number) => ({
      scale: [1, 1.2, 1],
      rotateY: [0, 15, -15, 0],
      z: [0, 20, 0],
      filter: [
        'none',
        'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))',
        'none'
      ],
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  // Split APP_NAME into individual letters for animation
  const letters = APP_NAME.split('');

  // Simplified logo display logic
  const shouldShowLogoDots = (isScrolled || needsSolidHeader) && !isLogoHovered;

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-500">
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
          {/* Logo with enhanced animations */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            {/* Four-Circle Logo with animations */}
            <AnimatePresence mode="wait" key={`logo-${shouldShowLogoDots}`}>
              {shouldShowLogoDots && (
                <motion.div 
                  className="relative w-8 h-8 flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" className="w-full h-full">
                    {/* Glow effects behind each circle */}
                    <motion.circle 
                      cx="10" 
                      cy="10" 
                      r="8" 
                      fill="rgba(139, 92, 246, 0.3)"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.6, 0]
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
                      r="8" 
                      fill="rgba(59, 130, 246, 0.3)"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.6, 0]
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
                      r="8" 
                      fill="rgba(124, 58, 237, 0.3)"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.6, 0]
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
                      r="8" 
                      fill="rgba(71, 85, 105, 0.3)"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.6, 0]
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
                        opacity: [0.3, 1, 0.3]
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
                        opacity: [0.3, 1, 0.3]
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
                        opacity: [0.3, 1, 0.3]
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
                        opacity: [0.3, 1, 0.3]
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
              )}
            </AnimatePresence>
            
            {/* Enhanced APP_NAME with hide/show animation - Fixed width container */}
            <div className={`font-semibold text-2xl transition-all duration-500 ${getTextColor()} relative flex items-center`} style={{ width: isLogoHovered ? '280px' : '60px', height: '32px' }}>
              {/* MDI - Fade out on hover - Aligned with logo center */}
              <motion.div
                className="absolute left-0 flex perspective-1000 items-center h-full"
                animate={{
                  opacity: isLogoHovered ? 0 : 1,
                  x: isLogoHovered ? -20 : 0
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {letters.map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    custom={index}
                    variants={letterVariants}
                    initial="initial"
                    animate={isLogoHovered ? "hover" : "initial"}
                    className="inline-block transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
              
              {/* "— My Design Index" with subtitle - Fade in on hover - Centered to match MDI alignment */}
              <motion.div
                className="absolute left-0 flex items-center h-full whitespace-nowrap"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isLogoHovered ? 1 : 0,
                  x: isLogoHovered ? 0 : 20
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: isLogoHovered ? 0.2 : 0
                }}
              >
                <div className="flex flex-col">
                  <span className={`font-normal text-xl leading-tight -ml-12 ${(isScrolled || needsSolidHeader) ? 'text-slate-600' : 'text-white/90'}`}>
                    — My Design Index
                  </span>
                  <motion.span 
                    className={`font-light text-xs leading-tight mt-0.5 ${(isScrolled || needsSolidHeader) ? 'text-slate-500' : 'text-white/70'}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                      opacity: isLogoHovered ? 1 : 0,
                      y: isLogoHovered ? 0 : 5
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: isLogoHovered ? 0.4 : 0
                    }}
                  >
                    Where Interior Design Meets Ecommerce
                  </motion.span>
                </div>
              </motion.div>
            </div>
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

                {/* Enhanced User Dropdown Menu - Updated styling to match Navbar */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-5 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-xl py-2 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                    >
                      {/* Header section */}
                      <div className="px-4 py-3 border-b border-slate-200/50">
                        <div className="flex items-center gap-3">
                          {/* Enhanced avatar */}
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
                            {/*<User size={16} className="text-slate-500" />*/}
                            <span className="text-sm font-medium text-slate-700">Subscription</span>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPlanColor()}`}>
                            {getPlanDisplayName()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Account Settings button */}
                      <motion.button 
                        onClick={handleAccountClick}
                        className="group w-full px-4 py-3 text-left transition-all duration-300 relative overflow-hidden"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-slate-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        
                        <div className="relative z-10 flex items-center gap-3">
                          {/*<Settings size={16} />*/}
                          <div>
                            <span className="font-medium text-slate-700 group-hover:text-slate-800 transition-colors">
                              Manage
                            </span>
                            <p className="text-xs text-slate-500">Manage your account settings</p>
                          </div>
                        </div>
                      </motion.button>

                      {subscription.tier === 'free' && (
                        <motion.button 
                          onClick={handleUpgradeClick}
                          className="group w-full px-4 py-3 text-left transition-all duration-300 relative overflow-hidden"
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-violet-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                          
                          <div className="relative z-10 flex items-center gap-3">
                            {/*<Crown size={16} />*/}
                            <div>
                              <span className="font-medium text-violet-600 group-hover:text-violet-700 transition-colors">
                                Upgrade Plan
                              </span>
                              <p className="text-xs text-slate-500">Want to remove ads?</p>
                            </div>
                          </div>
                        </motion.button>
                      )}
                      
                      {/* Divider */}
                      <div className="border-t border-slate-200/50 mt-2 pt-2">
                        {/* Enhanced Sign out button */}
                        <motion.button 
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="group w-full px-4 py-3 text-left transition-all duration-300 relative overflow-hidden disabled:opacity-50"
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-red-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                          
                          <div className="relative z-10 flex items-center gap-3">
                            {/*<LogOut size={16} />*/}
                            <span className="text-red-600 group-hover:text-red-700 transition-colors font-medium">
                              {isLoggingOut ? 'Signing out...' : 'Sign out'}
                            </span>
                          </div>
                        </motion.button>
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