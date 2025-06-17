import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_NAME } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

const TransparentHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

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
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-500">
      {/* Completely transparent background */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled ? 'bg-white/70 backdrop-blur-sm border-b border-slate-200/30 shadow-sm' : 'bg-transparent'
        }`}
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
                <circle cx="10" cy="10" r="6" fill="#8b5cf6" />
                <circle cx="22" cy="10" r="6" fill="#3b82f6" />
                <circle cx="10" cy="22" r="6" fill="#7c3aed" />
                <circle cx="22" cy="22" r="6" fill="#475569" />
              </svg>
            </div>
            
            {/* MDI text in slate-900 */}
            <span className="font-semibold text-2xl text-slate-900">
              MDI
            </span>
          </button>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/studio" 
                  className={`px-5 py-2.5 font-medium text-sm transition-all duration-300 rounded-full ${
                    isScrolled ? 'text-slate-700 hover:bg-slate-100/60' : 'text-slate-700 hover:bg-white/10'
                  }`}
                  style={{ minWidth: '80px', textAlign: 'center', display: 'inline-block' }}
                >
                  Studio
                </Link>
                <button
                  onClick={handleLogout}
                  className={`px-5 py-2.5 font-medium text-sm transition-all duration-300 rounded-full ${
                    isScrolled ? 'text-slate-700 hover:bg-slate-100/60' : 'text-slate-700 hover:bg-white/10'
                  }`}
                  style={{ minWidth: '80px', textAlign: 'center', display: 'inline-block' }}
                >
                  Sign out
                </button>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;