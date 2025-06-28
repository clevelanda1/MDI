import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Search, ShoppingBag, Palette } from 'lucide-react';

interface CurationHeroProps {
  projectName: string;
}

const CurationHero: React.FC<CurationHeroProps> = ({ projectName }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const features = [
    "Curated Selections",
    "Premium Collections", 
    "Design Inspirations",
    "Handpicked Products"
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
    
    // Feature text cycling - only if no project name
    if (!projectName) {
      const interval = setInterval(() => {
        setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [projectName]);

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
              <pattern id="curation-premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
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
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 5,-3; -2,4; 0,0"
                    dur="8s"
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
                  <animate 
                    attributeName="r" 
                    values="0.8;2.2;0.8" 
                    dur="6s" 
                    repeatCount="indefinite"
                    begin="1s"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; -3,2; 4,-1; 0,0"
                    dur="10s"
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
                  <animate 
                    attributeName="r" 
                    values="1;2.5;1" 
                    dur="5s" 
                    repeatCount="indefinite"
                    begin="2s"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 2,5; -4,-2; 0,0"
                    dur="12s"
                    repeatCount="indefinite"
                    begin="2s"
                  />
                </circle>
                <circle 
                  cx="70" 
                  cy="60" 
                  r="1.2" 
                  fill="#f59e0b"
                  opacity="0.25"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.1;0.6;0.1" 
                    dur="6s" 
                    repeatCount="indefinite"
                    begin="3s"
                  />
                  <animate 
                    attributeName="r" 
                    values="0.8;2.8;0.8" 
                    dur="7s" 
                    repeatCount="indefinite"
                    begin="3s"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; -6,1; 3,-5; 0,0"
                    dur="14s"
                    repeatCount="indefinite"
                    begin="3s"
                  />
                </circle>
                <circle 
                  cx="10" 
                  cy="60" 
                  r="0.8" 
                  fill="#ec4899"
                  opacity="0.35"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.2;0.8;0.2" 
                    dur="4.5s" 
                    repeatCount="indefinite"
                    begin="1.5s"
                  />
                  <animate 
                    attributeName="r" 
                    values="0.5;2;0.5" 
                    dur="5.5s" 
                    repeatCount="indefinite"
                    begin="1.5s"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 4,3; -2,-4; 0,0"
                    dur="9s"
                    repeatCount="indefinite"
                    begin="1.5s"
                  />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#curation-premium-grid)" />
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button with colorful hover effect */}
          <motion.div 
            variants={itemVariants}
            className="flex mb-8"
          >
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-emerald-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
              
              <a 
                href="/studio"
                className="relative inline-flex items-center text-slate-300 hover:text-white transition-all duration-300 font-medium group bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full hover:bg-white/20"
              >
                <svg 
                  className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Back to Studio</span>
              </a>
            </div>
          </motion.div>



          {/* Enhanced Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="font-black text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 leading-[0.9] tracking-tight"
          >
            {projectName ? (
              <>
                <span className="text-white block mb-2">{projectName}</span>
                <span className="font-[900] bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent bg-[length:400%_100%]"
                  style={{
                    WebkitTextStroke: '1px transparent',
                    textShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  Product Selections
                </span>
              </>
            ) : (
              <>
                <span className="text-white block mb-2">
                  Discover
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
              </>
            )}
          </motion.h1>
          
          {/* Enhanced Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl font-light mb-10"
          >
            Discover a curated selection of premium furniture and décor from Amazon and Etsy, 
            tailored to your space and style preference.
          </motion.p>


        </motion.div>
      </div>
    </motion.div>
  );
};

export default CurationHero;