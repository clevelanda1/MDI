import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const StudioHero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8497089190565366';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialize AdSense after component mounts
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white py-16 lg:py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" className="text-white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Content - Left Side */}
          <motion.div 
            className="lg:col-span-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="w-16 h-1 bg-gradient-to-r from-violet-400 to-blue-400 mb-6 rounded-full"
            />
            
            <motion.h1 
              variants={itemVariants}
              className="font-light text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
            >
              Your AI-Powered
              <span className="block font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Design Studio
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-slate-300 leading-relaxed max-w-3xl font-light"
            >
              Transform your space with intelligent design analysis. Upload any interior design and receive 
              curated recommendations from both Amazon and Etsy, powered by My Design Index.
            </motion.p>
          </motion.div>

          {/* AdSense Ad - Right Side */}
          <motion.div 
            className="lg:col-span-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
              {/* Debug: Show placeholder when ad doesn't load */}
              <div className="min-h-[250px] flex items-center justify-center text-slate-400 text-sm">
                <div className="text-center">
                  <div className="mb-2">Ad Space</div>
                  <div className="text-xs opacity-60">Loading...</div>
                </div>
              </div>
              <ins 
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-8497089190565366"
                data-ad-slot="3152769148"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudioHero;