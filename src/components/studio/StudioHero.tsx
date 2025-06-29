import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Palette, Upload, Search, ShoppingBag } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const StudioHero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const features = [
    "AI-Powered Design Analysis",
    "Instant Product Matching", 
    "Smart Recommendations",
    "Curated Shopping Experience"
  ];

  const processSteps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Share your design inspiration"
    },
    {
      icon: Search,
      title: "Analyze",
      description: "AI identifies key elements"
    },
    {
      icon: ShoppingBag,
      title: "Shop",
      description: "Get curated recommendations"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }
    }
  };

  // Initialize animations and feature cycling
  useEffect(() => {
    setIsLoaded(true);
    
    // Feature text cycling
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initialize AdSense after component mounts
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('Hero AdSense initialized successfully');
        } else {
          console.log('AdSense not available yet in hero section');
        }
      } catch (e) {
        console.error('Hero AdSense error:', e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated geometric pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="studio-premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="2" 
                  fill="#8b5cf6"
                  opacity="0.6"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.3;0.9;0.3" 
                    dur="4s" 
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="r" 
                    values="1.5;3;1.5" 
                    dur="5s" 
                    repeatCount="indefinite"
                  />
                </circle>
                <circle 
                  cx="20" 
                  cy="20" 
                  r="1" 
                  fill="#3b82f6"
                  opacity="0.5"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.2;0.8;0.2" 
                    dur="6s" 
                    repeatCount="indefinite"
                    begin="1s"
                  />
                </circle>
                <circle 
                  cx="60" 
                  cy="20" 
                  r="1.5" 
                  fill="#06d6a0"
                  opacity="0.6"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.3;1;0.3" 
                    dur="5s" 
                    repeatCount="indefinite"
                    begin="2s"
                  />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#studio-premium-grid)" />
          </svg>
        </div>

        {/* Premium floating elements */}
        <motion.div
          className="absolute top-1/4 right-1/6 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/6 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-cyan-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
            rotate: [360, 240, 120, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Enhanced Main Content - Left Side */}
          <motion.div 
            className="lg:col-span-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Premium Status Badge */}
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <div className="group relative inline-block">
                <div className="absolute inset-0 -m-4 bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-emerald-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                
                <div className="relative inline-flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl">
                  <div className="relative flex items-center">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-lg"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-white text-sm font-semibold tracking-wide">
                    AI-Powered Design Studio
                  </span>
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Main Title */}
            <motion.h1 
              variants={itemVariants}
              className="font-black text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 leading-[0.9] tracking-tight"
            >
              <span className="text-white block mb-2">
                Transform Your Space
              </span>
              
              {/* Dynamic animated text */}
              <div className="relative overflow-hidden" style={{ height: '1.1em' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentFeatureIndex}
                    className="font-[900] bg-gradient-to-r from-violet-400 via-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent bg-[length:400%_100%] absolute inset-0 flex items-center whitespace-nowrap"
                    style={{
                      WebkitTextStroke: '1px transparent',
                      textShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                    }}
                    initial={{ 
                      opacity: 0,
                      y: 100,
                      scale: 0.8,
                      rotateX: -30,
                      filter: "blur(20px)"
                    }}
                    animate={{ 
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateX: 0,
                      filter: "blur(0px)",
                      backgroundPosition: ["0% 50%", "100% 50%", "200% 50%"]
                    }}
                    exit={{ 
                      opacity: 0,
                      y: -100,
                      scale: 0.8,
                      rotateX: 30,
                      filter: "blur(20px)"
                    }}
                    transition={{
                      duration: 1.4,
                      ease: [0.165, 0.84, 0.44, 1],
                      backgroundPosition: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  >
                    {features[currentFeatureIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>
            
            {/* Enhanced Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl font-light mb-10"
            >
              Upload any interior design and receive intelligent, curated recommendations from Amazon and Etsy. 
              My Design Index analyzes your space and suggests perfect products to bring your vision to life.
            </motion.p>
          </motion.div>

          {/* Enhanced AdSense Ad - Right Side */}
          <motion.div 
            className="lg:col-span-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-2xl shadow-slate-900/20 relative overflow-hidden aspect-square"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10 h-full flex flex-col">
                {/* Ad Header - Using ProjectsSection styling */}
                <div className="mb-4 px-0">
                  <h3 className="text-white font-bold text-sm tracking-wide uppercase">
                    SPONSORED LINKS
                  </h3>
                </div>
                
                {/* AdSense Container */}
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex-1">
                  <ins 
                    className="adsbygoogle"
                    style={{ 
                      display: 'block',
                      width: '100%',
                      height: '100%'
                    }}
                    data-ad-client="ca-pub-8497089190565366"
                    data-ad-slot="3152769148"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudioHero;