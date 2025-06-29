import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // Enhanced text options
  const textOptions = [
    "With Zero Effort",
    "And Shop The Look", 
    "Get Instant Results",
    "With Creative Freedom"
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]));
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]));

  useEffect(() => {
    setIsLoaded(true);
    
    const startTextCycle = () => {
      let currentIndex = 0;
      
      const cycleText = () => {
        setIsTransitioning(true);
        
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % textOptions.length;
          setCurrentTextIndex(currentIndex);
          setIsTransitioning(false);
        }, 400);
      };
      
      const initialDelay = setTimeout(() => {
        const interval = setInterval(cycleText, 3500);
        return () => clearInterval(interval);
      }, 4000);
      
      return () => clearTimeout(initialDelay);
    };
    
    const cleanup = startTextCycle();
    return cleanup;
  }, [textOptions.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Dark Premium Background for Top Section */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-white"></div>
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Animated geometric pattern with enhanced motion */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="2" 
                  fill="#8b5cf6"
                  opacity="0.3"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.1;0.8;0.1" 
                    dur="3s" 
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="r" 
                    values="1.5;3;1.5" 
                    dur="4s" 
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
                  opacity="0.4"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.2;0.9;0.2" 
                    dur="5s" 
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
                  opacity="0.3"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.15;0.7;0.15" 
                    dur="4s" 
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
                {/* Additional floating dots for more dynamic feel */}
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
                <path d="M0,40 L80,40 M40,0 L40,80" stroke="#475569" strokeWidth="0.5" opacity="0.1">
                  <animate 
                    attributeName="opacity" 
                    values="0.05;0.2;0.05" 
                    dur="8s" 
                    repeatCount="indefinite"
                  />
                </path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#premium-grid)" />
          </svg>
        </div>

        {/* Premium floating elements */}
        <motion.div
          className="absolute top-1/4 right-1/5 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/10 via-blue-500/5 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/6 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/8 via-teal-500/4 to-cyan-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen">
        
        {/* TOP SECTION - Revolutionary Dark Design */}
        <div className="relative pt-28 pb-28 px-8 lg:px-16 min-h-[90vh] flex flex-col justify-center">
          
          {/* Premium Status Badge - Now clickable */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -40 }}
            transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1] }}
            className="flex justify-center mb-12"
          >
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-emerald-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
              
              <motion.button
                onClick={handleSignIn}
                className="relative inline-flex items-center gap-5 px-8 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-700 cursor-pointer hover:bg-white/15"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-300 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                <span className="text-white text-base font-black tracking-wide">
                  Sign In to MDI Design Studio v1.0
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Revolutionary Hero Layout - Product Focus */}
          <div className="max-w-8xl mx-auto">
            
            {/* Main Headline - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 60 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
              className="text-center mb-16"
            >
              <h1 className="text-[32px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-[0.9] tracking-[-0.04em] font-black mb-8">
                <span className="text-white block mb-2">
                  Design Your Dream Space,
                </span>
                
                {/* Dynamic animated text with room focus */}
                <div className="relative overflow-hidden" style={{ height: '1.5em' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentTextIndex}
                      className="font-[900] bg-gradient-to-r from-violet-400 via-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent bg-[length:400%_100%] absolute inset-0 flex items-center justify-center"
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
                      {textOptions[currentTextIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                transition={{ duration: 1.2, delay: 0.7, ease: [0.165, 0.84, 0.44, 1] }}
                className="text-xl md:text-2xl text-white/90 font-light leading-[1.4] mb-12 max-w-5xl mx-auto"
              >
                Transform your interior design vision into reality with My Design Index — Turn any room design inspiration into an actionable, shoppable experience in moments, not months.
              </motion.p>
            </motion.div>

            {/* CTAs - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
              transition={{ duration: 1.2, delay: 1.0 }}
              className="flex justify-center items-center max-w-lg mx-auto"
            >
              {/* Primary CTA */}
              <motion.button
                onClick={handleGetStarted}
                className="group relative px-8 py-4 text-xl font-bold rounded-full overflow-hidden w-full sm:w-auto"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <span className="relative text-white flex items-center justify-center gap-3 tracking-wide">
                  Get Started For Free
                  <motion.span
                    className="inline-block text-2xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* MIDDLE SECTION - Studio Interface Preview (Updated to match actual interface) */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 60, scale: isLoaded ? 1 : 0.95 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-16"
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }}
            className="relative"
          >
            {/* Main Studio Interface Card */}
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl shadow-slate-900/10 p-6 overflow-hidden">
              
              {/* Studio Interface Layout - Updated to match real interface */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Upload Section - Left Side */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-2xl border border-slate-200/40 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"></div>
                      <h3 className="font-bold text-xl text-slate-900">New Project</h3>
                    </div>
                    
                    {/* Upload Area with bedroom image */}
                    <div className="border-2 border-dashed border-slate-300/60 rounded-3xl p-8 text-center mb-6 bg-gradient-to-br from-violet-50/40 to-blue-50/30">
                      <div className="relative group">
                        <img 
                          src="/api/placeholder/280/180" 
                          alt="Bedroom Design"
                          className="w-full h-44 object-cover rounded-2xl shadow-2xl border border-white/60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="mt-6 flex justify-center">
                        <div className="inline-flex items-center space-x-3 px-4 py-3 rounded-2xl border bg-emerald-50/80 border-emerald-200/60 text-emerald-700 font-medium">
                          <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span>Analysis complete!</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Detected Elements */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-sm animate-pulse"></div>
                        </div>
                        <h4 className="font-bold text-xl text-slate-900">Detected Elements</h4>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-base font-bold px-8 py-2 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 w-fit">
                          3 Elements
                        </span>
                        <button className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all duration-200 flex items-center justify-center gap-2">
                          {/*<span className="text-sm">+</span>*/}
                          Select All
                        </button>
                      </div>

                      {/* Element list items */}
                      <div className="space-y-3">
                        {[
                          { letter: 'S', name: 'Sofa', color: 'bg-blue-100 text-blue-700' },
                          { letter: 'C', name: 'Coffee Table', color: 'bg-green-100 text-green-700' },
                          { letter: 'L', name: 'Lighting', color: 'bg-yellow-100 text-yellow-700' }
                        ].map((item, i) => (
                          <div key={item.name} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-slate-200/60 hover:shadow-sm transition-all duration-200">
                            <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center font-bold text-sm`}>
                              {item.letter}
                            </div>
                            <span className="text-slate-800 font-medium">{item.name}</span>
                            <div className="ml-auto flex gap-1">
                              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full border border-orange-200/60">
                                Amazon
                              </span>
                              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full border border-teal-200/60">
                                Etsy
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Search button */}
                      <button className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold text-lg hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-xl">
                        Search Recommendations
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Projects Section - Right Side */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full"></div>
                    <h3 className="font-light text-3xl text-slate-900">
                      Your <span className="font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Projects</span>
                    </h3>
                    <span className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold border border-violet-200">
                      4
                    </span>
                  </div>
                  
                  {/* Search bar */}
                  <div className="relative group mb-8">
                    <input 
                      type="text" 
                      placeholder="Search your projects..." 
                      className="pl-12 pr-12 py-4 border border-slate-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm w-full group-hover:border-slate-400/70 shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Project Cards Grid - 4 projects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Project 1 - Modern Living Room */}
                    <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 group">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src="/images/modern-living-room.jpg" 
                          alt="Modern Living Room"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/280';
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Live
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/95 text-slate-900 hover:bg-white font-semibold rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-200">
                              View Project
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-xl text-slate-900 leading-tight">Modern Living Room</h4>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span className="font-medium">Generated in 2.1 seconds</span>
                          </div>
                          
                          <span className="px-4 py-2 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                            Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project 2 - Cozy Bedroom */}
                    <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 group">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src="/images/cozy-bedroom.jpg" 
                          alt="Cozy Bedroom"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/280';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/95 text-slate-900 hover:bg-white font-semibold rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-200">
                              View Project
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-xl text-slate-900 leading-tight">Cozy Bedroom</h4>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span className="font-medium">March 15, 2024</span>
                          </div>
                          
                          <span className="px-4 py-2 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                            Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project 3 - Kitchen Space */}
                    <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 group">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src="/images/kitchen-space.jpg" 
                          alt="Kitchen Space"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/280';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/95 text-slate-900 hover:bg-white font-semibold rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-200">
                              View Project
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-xl text-slate-900 leading-tight">Kitchen Space</h4>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span className="font-medium">March 12, 2024</span>
                          </div>
                          
                          <span className="px-4 py-2 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                            Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project 4 - Bathroom Design */}
                    <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 group">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src="/images/bathroom-design.jpg" 
                          alt="Bathroom Design"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/280';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/95 text-slate-900 hover:bg-white font-semibold rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-200">
                              View Project
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-xl text-slate-900 leading-tight">Bathroom Design</h4>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span className="font-medium">March 10, 2024</span>
                          </div>
                          
                          <span className="px-4 py-2 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                            Complete
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM SECTION - Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-center pb-20 px-8"
        >
          <p className="text-slate-500 text-sm font-bold mb-8 tracking-wide uppercase">
            Trusted by design professionals worldwide
          </p>
          <div className="flex items-center justify-center gap-16 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-slate-700">10K+</span>
              <span className="text-sm font-medium">Inspirations Uploaded</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-slate-700">1M+</span>
              <span className="text-sm font-medium">Products Matched</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="text-amber-500 text-xl">★★★★★</div>
              <span className="text-sm text-slate-700 font-bold">4.9/5</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;