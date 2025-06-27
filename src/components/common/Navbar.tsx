import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Crown, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [logoColorStates] = useState([0, 1, 2, 3]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const colorGradients = [
    { id: 'gradient1', colors: ['#8b5cf6', '#a855f7'] },
    { id: 'gradient2', colors: ['#3b82f6', '#2563eb'] },
    { id: 'gradient3', colors: ['#7c3aed', '#6d28d9'] },
    { id: 'gradient4', colors: ['#475569', '#334155'] },
  ];

  const solidNavbarPages = ['/studio', '/curation', '/visionboard', '/upgrade', '/account'];
  const needsSolidNavbar = solidNavbarPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/studio');
    } else {
      navigate('/');
    }
  };

  const handleUpgradeClick = () => {
    setIsUserMenuOpen(false);
    navigate('/upgrade');
  };

  const handleAccountClick = () => {
    setIsUserMenuOpen(false);
    navigate('/account');
  };

  const getNavbarStyle = () => {
    if (needsSolidNavbar || isScrolled) {
      return {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        backgroundColor: !CSS?.supports?.('backdrop-filter', 'blur(20px)') 
          ? 'rgba(255, 255, 255, 0.98)' 
          : undefined
      };
    }
    return { background: 'transparent' };
  };

  const getTextColor = () => {
    return (needsSolidNavbar || isScrolled) ? 'text-slate-900' : 'text-white';
  };

  const getTextColorSecondary = () => {
    return (needsSolidNavbar || isScrolled) ? 'text-slate-700' : 'text-white/90';
  };

  const getHoverBg = () => {
    return (needsSolidNavbar || isScrolled) ? 'rgba(148, 163, 184, 0.1)' : 'rgba(255, 255, 255, 0.15)';
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
        isScrolled || needsSolidNavbar ? 'py-3' : 'py-4'
      }`}
      style={{ ...getNavbarStyle(), zIndex: 9999 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center relative">
        
        {/* LOGO ONLY - No text whatsoever */}
        <button onClick={handleLogoClick} className="flex items-center z-10 group">
          <motion.div 
            className="relative w-8 h-8 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className="w-full h-full">
              {/* Glow effects */}
              <motion.circle 
                cx="10" cy="10" r="8" 
                fill="rgba(139, 92, 246, 0.3)"
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              />
              <motion.circle 
                cx="22" cy="10" r="8" 
                fill="rgba(59, 130, 246, 0.3)"
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
              <motion.circle 
                cx="10" cy="22" r="8" 
                fill="rgba(124, 58, 237, 0.3)"
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              />
              <motion.circle 
                cx="22" cy="22" r="8" 
                fill="rgba(71, 85, 105, 0.3)"
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
              />

              {/* Main circles */}
              <motion.circle 
                cx="10" cy="10" r="6" 
                fill={`url(#${colorGradients[0].id})`}
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 1, opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  scale: { delay: 0.1, type: "spring", stiffness: 400, damping: 17 },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }
                }}
              />
              <motion.circle 
                cx="22" cy="10" r="6" 
                fill={`url(#${colorGradients[1].id})`}
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 1, opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  scale: { delay: 0.2, type: "spring", stiffness: 400, damping: 17 },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
                }}
              />
              <motion.circle 
                cx="10" cy="22" r="6" 
                fill={`url(#${colorGradients[2].id})`}
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 1, opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  scale: { delay: 0.3, type: "spring", stiffness: 400, damping: 17 },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
                }}
              />
              <motion.circle 
                cx="22" cy="22" r="6" 
                fill={`url(#${colorGradients[3].id})`}
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 1, opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  scale: { delay: 0.4, type: "spring", stiffness: 400, damping: 17 },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.8 }
                }}
              />
              
              <defs>
                {colorGradients.map((gradient) => (
                  <linearGradient key={gradient.id} id={gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={gradient.colors[0]} />
                    <stop offset="100%" stopColor={gradient.colors[1]} />
                  </linearGradient>
                ))}
              </defs>
            </svg>
          </motion.div>
        </button>

        {/* MIDDLE SECTION - COMPLETELY EMPTY */}
        <div className="flex-1"></div>

        {/* RIGHT SECTION - Only show user menu if authenticated */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center">
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300"
                style={{ background: isUserMenuOpen ? getHoverBg() : 'transparent' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className={`font-medium text-sm ${getTextColorSecondary()}`}>
                  {user?.user_metadata?.first_name || 'User'}
                </span>
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-full mt-5 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-xl py-2 z-50"
                  >
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
                    
                    <motion.button onClick={handleAccountClick} className="group w-full px-4 py-3 text-left transition-all duration-300 relative overflow-hidden" whileHover={{ x: 2 }}>
                      <motion.div className="absolute inset-0 bg-slate-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-center gap-3">
                        <div>
                          <span className="font-medium text-slate-700 group-hover:text-slate-800 transition-colors">Account</span>
                          <p className="text-xs text-slate-500">Manage your account</p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button onClick={handleUpgradeClick} className="group w-full px-4 py-3 text-left transition-all duration-300 relative overflow-hidden" whileHover={{ x: 2 }}>
                      <motion.div className="absolute inset-0 bg-violet-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-center gap-3">
                        <div>
                          <span className="font-medium text-violet-600 group-hover:text-violet-700 transition-colors">Upgrade</span>
                          <p className="text-xs text-slate-500">Want to remove ads?</p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <div className="border-t border-slate-200/50 mt-2 pt-2">
                      <motion.button onClick={handleLogout} className="group w-full px-4 py-3 text-left transition-all duration-300 relative overflow-hidden" whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                        <motion.div className="absolute inset-0 bg-red-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-center gap-3">
                          <span className="text-red-600 group-hover:text-red-700 transition-colors font-medium">Sign Out</span>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : null}

        {/* Mobile menu button */}
        <motion.button 
          className="md:hidden z-10 p-2.5 rounded-full transition-all duration-300"
          style={{
            background: (needsSolidNavbar || isScrolled) ? 'rgba(148, 163, 184, 0.1)' : 'rgba(255, 255, 255, 0.1)',
            minWidth: '44px',
            minHeight: '44px'
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className={`h-5 w-5 ${getTextColor()}`} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu className={`h-5 w-5 ${getTextColor()}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 right-0"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="space-y-2">
                {isAuthenticated && user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0, duration: 0.4, ease: "easeOut" }}
                    className="flex items-center gap-3 p-4 bg-slate-100/60 rounded-2xl mb-4"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                      </p>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                    </div>
                  </motion.div>
                )}

                {isAuthenticated && (
                  <>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}>
                      <button onClick={() => { setIsMenuOpen(false); navigate('/account'); }} className="flex items-center justify-between font-medium text-slate-700 hover:text-slate-900 py-4 px-4 rounded-2xl transition-all duration-300 group bg-white/60 hover:bg-white/80 w-full text-left">
                        <div className="flex items-center gap-3">
                          <Settings size={18} />
                          <span className="text-lg">Account Settings</span>
                        </div>
                      </button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}>
                      <button onClick={() => { setIsMenuOpen(false); navigate('/upgrade'); }} className="flex items-center justify-between font-medium text-violet-600 hover:text-violet-700 py-4 px-4 rounded-2xl transition-all duration-300 group bg-violet-50/60 hover:bg-violet-100/60 w-full text-left">
                        <div className="flex items-center gap-3">
                          <Crown size={18} />
                          <span className="text-lg">Upgrade Plan</span>
                        </div>
                      </button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }} className="space-y-3 pt-4 border-t border-slate-200/50">
                      <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="block w-full text-center py-4 px-6 font-medium text-red-600 hover:text-red-700 rounded-2xl transition-all duration-300 bg-white/60 hover:bg-red-50/80">
                        Sign out
                      </button>
                    </motion.div>
                  </>
                )}

                {!isAuthenticated && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }} className="space-y-3 pt-4">
                    <button onClick={() => { setIsMenuOpen(false); navigate('/signin'); }} className="block w-full text-center py-4 px-6 font-medium text-slate-700 hover:text-slate-900 rounded-2xl transition-all duration-300 bg-white/60 hover:bg-white/80">
                      Sign in
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isUserMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />}
    </motion.nav>
  );
};

export default Navbar;