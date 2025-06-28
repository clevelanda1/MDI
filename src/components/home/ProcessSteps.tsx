import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Search, ShoppingCart } from 'lucide-react';
import { PROCESS_STEPS } from '../../utils/constants';

const ProcessSteps: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const navigate = useNavigate();

  // Enhanced scroll transforms
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const iconComponents: Record<string, React.ReactNode> = {
    Upload: <Upload size={28} className="text-white" />,
    Search: <Search size={28} className="text-white" />,
    Cart: <ShoppingCart size={28} className="text-white" />
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        ease: [0.165, 0.84, 0.44, 1]
      } 
    }
  };

  const handleExperienceProcess = () => {
    navigate('/signup');
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-32 lg:py-40 bg-gradient-to-b from-white via-slate-50/50 to-slate-900/5 overflow-hidden"
    >
      {/* Premium Background Elements - Consistent with Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="process-premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle 
                  cx="30" 
                  cy="30" 
                  r="1.5" 
                  fill="#8b5cf6"
                  opacity="0.4"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.2;0.6;0.2" 
                    dur="6s" 
                    repeatCount="indefinite"
                  />
                </circle>
                <circle 
                  cx="15" 
                  cy="15" 
                  r="1" 
                  fill="#3b82f6"
                  opacity="0.3"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.3;0.7;0.3" 
                    dur="8s" 
                    repeatCount="indefinite"
                    begin="2s"
                  />
                </circle>
                <path d="M0,30 L60,30 M30,0 L30,60" stroke="#475569" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#process-premium-grid)" />
          </svg>
        </div>

        {/* Premium floating elements - matching Hero style */}
        <motion.div
          className="absolute top-1/4 right-1/6 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/8 via-blue-500/4 to-purple-500/8 rounded-full blur-3xl"
          style={{ y }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/5 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/6 via-teal-500/3 to-cyan-500/6 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -30, 0],
            y: [0, 40, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{ opacity }}
      >
        {/* Premium Header - Matching Hero Style */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1] }}
          viewport={{ once: true }}
        >
          {/* Premium Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
              
              <div className="relative inline-flex items-center gap-4 px-6 py-3 bg-white/20 backdrop-blur-2xl border border-slate-200/40 rounded-full shadow-lg hover:shadow-xl transition-all duration-700">
                <div className="relative flex items-center">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-lg"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></div>
                </div>
                
                <span className="text-slate-700 text-sm font-bold tracking-wide">
                  How It Works
                </span>
              </div>
            </div>
          </motion.div>

          <h2 className="text-[32px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-[0.9] tracking-[-0.03em] font-black mb-8">
            <span className="text-slate-900 block mb-2">
              Our Revolutionary
            </span>
            
            <motion.span 
              className="font-[900] bg-gradient-to-r from-violet-600 via-blue-600 via-emerald-600 to-violet-600 bg-clip-text text-transparent bg-[length:400%_100%]"
              style={{
                WebkitTextStroke: '1px transparent',
                textShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "200% 50%"]
              }}
              transition={{
                backgroundPosition: { 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear"
                }
              }}
            >
              Design Process
            </motion.span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-slate-600/90 max-w-4xl mx-auto leading-[1.4] font-light"
          >
            Experience the future of interior design through our AI-powered analysis that transforms 
            spaces with unprecedented precision and creativity.
          </motion.p>
        </motion.div>
        
        {/* Premium Steps Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto relative mb-24"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {PROCESS_STEPS.map((step, index) => (
            <motion.div 
              key={step.id}
              className="relative group"
              variants={item}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Connection Lines - Enhanced */}
              {index < PROCESS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-24 -right-6 w-12 h-px z-10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-400/60 via-blue-400/60 to-emerald-400/60 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.8 + index * 0.2, ease: "easeOut" }}
                  />
                </div>
              )}

              {/* Premium Card Design */}
              <motion.div 
                className="relative flex flex-col items-center text-center p-10 lg:p-12 h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Premium Glass Card Background */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-slate-200/20 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:shadow-slate-900/10 transition-all duration-700" />
                
                {/* Premium Gradient Overlay on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-blue-50/40 to-emerald-50/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />

                {/* Animated Border Glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                    filter: 'blur(1px)',
                  }}
                />

                <div className="relative z-10">
                  {/* Premium Icon Container */}
                  <motion.div 
                    className="mb-8 relative"
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="relative">
                      {/* Enhanced Icon Background with Gradient */}
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                        {/* Animated shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                        <div className="relative z-10">
                          {iconComponents[step.icon]}
                        </div>
                      </div>
                      
                      {/* Floating particles around icon */}
                      {hoveredStep === index && (
                        <>
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-violet-400 rounded-full"
                              style={{
                                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}px`,
                                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 30}px`,
                              }}
                              animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Enhanced Step Number Badge */}
                  <motion.div
                    className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut", type: "spring", stiffness: 200 }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Premium Content */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600/90 leading-relaxed text-lg font-light">
                    {step.description}
                  </p>

                  {/* Enhanced Interactive Indicator */}
                  <motion.div
                    className="mt-8 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500"
                  >
                    <div className="relative">
                      <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-violet-400 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-violet-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <span className="text-sm text-slate-500 font-medium tracking-wide">AI Powered</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium CTA Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleExperienceProcess}
            className="group relative px-12 py-5 text-xl font-bold rounded-full overflow-hidden"
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <span className="relative text-white flex items-center justify-center gap-4 tracking-wide">
              Experience Our Process
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

        {/* Premium Curation Interface Preview - EXACT Hero Design Studio Match */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-6xl"
        >
          <motion.div
            style={{
              transformPerspective: 1200,
            }}
            className="relative"
          >
            {/* Main Curation Interface Card - EXACT Hero Styling */}
            <div className="bg-white/60 backdrop-blur-xl border border-slate-200/20 rounded-3xl shadow-2xl shadow-slate-900/10 p-1 overflow-hidden">
              <div className="bg-gradient-to-br from-slate-50/50 to-white/50 rounded-[20px] p-8">
                
                {/* Header Bar - EXACT Hero Styling */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/60"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400/60"></div>
                    </div>
                    <span className="text-slate-600 text-sm font-medium ml-4">Curated Selections</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Live</span>
                  </div>
                </div>

                {/* Curation Interface Layout - EXACT Hero Styling */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Filters Sidebar - EXACT Hero Upload Section Styling */}
                  <div className="lg:col-span-1">
                    <div className="bg-white/80 rounded-2xl p-6 border border-slate-200/20">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        <h3 className="font-semibold text-slate-900 text-sm">Smart Filters</h3>
                      </div>
                      
                      {/* AI Detected Elements Filter */}
                      <div className="mb-6">
                        <h4 className="text-xs font-medium text-slate-700 mb-3">AI Detected Elements</h4>
                        <div className="space-y-2">
                          {['Sofa', 'Coffee Table', 'Lighting', 'Rug'].map((item, i) => (
                            <div key={item} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                              <div className={`w-3 h-3 rounded-sm ${i < 2 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                              <span className="text-xs text-slate-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Price Range Filter */}
                      <div className="mb-6">
                        <h4 className="text-xs font-medium text-slate-700 mb-3">Price Range</h4>
                        <div className="space-y-2">
                          {['$0 - $100', '$100 - $500', '$500 - $1000'].map((range, i) => (
                            <div key={range} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                              <div className={`w-3 h-3 rounded-sm ${i === 1 ? 'bg-violet-500' : 'bg-slate-300'}`}></div>
                              <span className="text-xs text-slate-600">{range}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Marketplace Filter */}
                      <div className="mb-6">
                        <h4 className="text-xs font-medium text-slate-700 mb-3">Marketplace</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                            <span className="text-xs text-slate-600 font-medium">Amazon</span>
                            <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">24</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                            <span className="text-xs text-slate-600 font-medium">Etsy</span>
                            <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">12</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Grid - EXACT Hero Projects Gallery Styling */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900 text-sm">Curated Products</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs">🔍</span>
                        </div>
                        <div className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs">⚡</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Cards Grid - EXACT Hero Card Styling */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Product 1 - Modern Sofa with EXACT Hero Card Styling */}
                      <motion.div 
                        className="bg-white/80 rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm"
                        animate={{ 
                          boxShadow: [
                            "0 4px 6px -1px rgba(139, 92, 246, 0.1)",
                            "0 10px 15px -3px rgba(139, 92, 246, 0.2)",
                            "0 4px 6px -1px rgba(139, 92, 246, 0.1)"
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src="/images/l-shape-sofa.jpg" 
                            alt="Modern Sofa"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          {/* Fallback gradient */}
                          <div className="hidden w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
                          {/* Live indicator */}
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Live
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1">Modern L-Shape Sofa</h4>
                          <p className="text-xs text-slate-600 mb-2">$899 • Etsy • ★★★★★ (128)</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>⚡ AI Enhanced</span>
                              <span>🎨 Premium</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Product 2 - Coffee Table with EXACT Hero Card Styling */}
                      <div className="bg-white/80 rounded-2xl overflow-hidden border border-slate-200/20">
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src="/images/glass-table.jpg" 
                            alt="Coffee Table"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          {/* Fallback gradient */}
                          <div className="hidden w-full h-full bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50"></div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1">Glass Coffee Table</h4>
                          <p className="text-xs text-slate-600 mb-2">$299 • Amazon • ★★★★☆ (89)</p>
                          <div className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            Wishlist
                          </div>
                        </div>
                      </div>
                      
                      {/* Product 3 - Sectional Sofa with EXACT Hero Card Styling */}
                      <div className="bg-white/80 rounded-2xl overflow-hidden border border-white/20">
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src="/images/sectional-sofa.jpg" 
                            alt="Sectional Sofa"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          {/* Fallback gradient */}
                          <div className="hidden w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1">Sectional Sofa</h4>
                          <p className="text-xs text-slate-600 mb-2">$1,299 • Amazon • ★★★★★ (192)</p>
                          <div className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            Available
                          </div>
                        </div>
                      </div>
                      
                      {/* Product 4 - Round Coffee Table with EXACT Hero Card Styling */}
                      <div className="bg-white/80 rounded-2xl overflow-hidden border border-slate-200/20">
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src="/images/round-table.jpg" 
                            alt="Round Coffee Table"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          {/* Fallback gradient */}
                          <div className="hidden w-full h-full bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50"></div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1">Round Coffee Table</h4>
                          <p className="text-xs text-slate-600 mb-2">$249 • Etsy • ★★★★☆ (87)</p>
                          <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            Sale
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar - EXACT Hero Styling */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200/20">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 bg-slate-200/60 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <span className="text-sm font-medium">AI Curated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors duration-200 rounded-lg hover:bg-slate-100/60">
                      Share Collection
                    </button>
                    <button className="px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200">
                      Export
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProcessSteps;