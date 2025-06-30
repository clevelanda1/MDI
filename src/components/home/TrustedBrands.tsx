import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TrustedBrands: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visionBoardItems, setVisionBoardItems] = useState([
    { id: 1, name: 'HULALA HOME 127" Modular Sect...', price: 1069.90, image: '/images/leather-sofa.jpg', x: 50, y: 20, width: 200, height: 150 },
    { id: 2, name: 'Leather Sectional Couch', image: '/images/sectional-sofa.jpg', x: 280, y: 20, width: 180, height: 140 },
    { id: 3, name: 'Modern Living Room Cushion', image: '/images/front-table.jpg', x: 50, y: 200, width: 160, height: 120 },
    { id: 4, name: 'Mid Century Three Piece Sectional', image: '/images/plant-hanger.jpg', x: 240, y: 200, width: 180, height: 130 }
  ]);
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced scroll transforms
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Primary marketplace partners
  const primaryPartners = [
    {
      id: 'amazon',
      name: 'Amazon',
      description: 'Our primary sourcing partner with millions of curated design recommendations across every category imaginable.',
      fullDescription: 'Amazon brings unparalleled scale and convenience to your design journey. With Prime shipping, customer reviews, and our AI-powered curation, you can trust that every recommendation is backed by quality and reliability.',
      logo: 'A',
      color: 'from-orange-600 to-orange-700',
      bgColor: 'from-orange-50 to-amber-50',
      accentColor: 'orange',
      stats: { 
        products: '10M+', 
        availability: '99.9%', 
        specialty: 'Everything Home'
      },
      image: '/images/amazon.jpg'
    },
    {
      id: 'etsy',
      name: 'Etsy',
      description: 'Unique handmade and vintage finds from independent creators and artisans worldwide.',
      fullDescription: 'Etsy connects you with millions of talented creators offering one-of-a-kind pieces that you won\'t find anywhere else. From custom art to vintage treasures, discover items that truly reflect your personal style and make your space uniquely yours.',
      logo: 'E',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-cyan-50',
      accentColor: 'teal',
      stats: { 
        products: '120M+', 
        availability: '98.2%', 
        specialty: 'Handmade & Vintage'
      },
      image: '/images/etsy.jpg'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % primaryPartners.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [primaryPartners.length]);

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

  const currentPartner = primaryPartners[currentSlide];

  const handleStartShopping = () => {
    navigate('/signup');
  };

  // Remove item from vision board
  const removeVisionBoardItem = (itemId: number) => {
    setVisionBoardItems(items => items.filter(item => item.id !== itemId));
  };

  // Update item position
  const updateItemPosition = (itemId: number, x: number, y: number) => {
    setVisionBoardItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, x, y } : item
      )
    );
  };

  // Interior design products - using original data and images with realistic pricing
  const interiorProducts = [
    { 
      name: 'Modern Living Room Cushion, Velvet Cou...', 
      price: 189, 
      image: '/images/front-table.jpg',
      source: 'amazon',
      category: 'seating',
      project: 'Design Project 2'
    },
    { 
      name: 'Mid Century Three Piece Sectional Sofa', 
      price: 1299, 
      image: '/images/plant-hanger.jpg',
      source: 'etsy',
      category: 'furniture',
      project: 'Design Project 2'
    },
    { 
      name: 'Leather Sectional Couch with Ottoman...', 
      price: 899, 
      image: '/images/sectional-sofa.jpg',
      source: 'amazon',
      category: 'seating',
      project: 'Design Project 2'
    },
    { 
      name: 'HULALA HOME 127" Modular Sectional...', 
      price: 1569, 
      image: '/images/leather-sofa.jpg',
      source: 'etsy',
      category: 'furniture',
      project: 'Design Project 2'
    }
  ];

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
              <pattern id="brands-premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#brands-premium-grid)" />
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
          className={`absolute top-1/2 left-1/5 w-[500px] h-[500px] bg-gradient-to-br ${
            currentPartner.accentColor === 'orange' 
              ? 'from-orange-500/6 via-amber-500/3 to-orange-500/6' 
              : 'from-emerald-500/6 via-teal-500/3 to-cyan-500/6'
          } rounded-full blur-3xl`}
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
                  Trusted Partners
                </span>
              </div>
            </div>
          </motion.div>

          <h2 className="text-[32px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-[0.9] tracking-[-0.03em] font-black mb-8">
            <span className="text-slate-900 block mb-2">
              Powered by
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
              Premium Marketplaces
            </motion.span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-slate-600/90 max-w-4xl mx-auto leading-[1.4] font-light"
          >
            Access millions of curated design items through our partnerships with leading home retailers and artisan marketplaces. 
            Get instant recommendations for furniture, decor, and unique handmade accessories from trusted sources.
          </motion.p>
        </motion.div>
        
        {/* Enhanced Slideshow Container */}
        <motion.div 
          className="max-w-7xl mx-auto mb-24"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="relative">
            {/* Main Slideshow Card */}
            <motion.div 
              className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-slate-200/20 rounded-3xl shadow-2xl shadow-slate-900/10"
              variants={item}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Dynamic Background Gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${currentPartner.bgColor} opacity-30`}
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.8 }}
              />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
                {/* Left Side - Marketplace Image */}
                <div className="lg:col-span-1 relative overflow-hidden rounded-l-3xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <img 
                        src={currentPartner.image}
                        alt={`${currentPartner.name} marketplace`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      {/* Fallback gradient */}
                      <div className={`hidden w-full h-full bg-gradient-to-br ${currentPartner.bgColor} items-center justify-center`}>
                        <div className={`w-24 h-24 bg-gradient-to-br ${currentPartner.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                          <span className="text-white text-4xl font-bold">{currentPartner.logo}</span>
                        </div>
                      </div>
                      
                      {/* Overlay with logo */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-start p-8">
                        <motion.div 
                          className={`w-16 h-16 bg-gradient-to-br ${currentPartner.color} rounded-2xl flex items-center justify-center shadow-xl`}
                          whileHover={{ scale: 1.1, rotateY: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="text-white text-2xl font-bold">{currentPartner.logo}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Side - Partner Information */}
                <div className="lg:col-span-2 p-12 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="space-y-8"
                    >
                      {/* Header */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <motion.h3 
                            className="text-4xl font-bold text-slate-900"
                            layoutId={`title-${currentPartner.id}`}
                          >
                            {currentPartner.name}
                          </motion.h3>
                          <motion.div
                            className={`px-4 py-2 bg-${currentPartner.accentColor}-100 text-${currentPartner.accentColor}-700 border border-${currentPartner.accentColor}-200 rounded-full text-sm font-semibold`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            Primary Partner
                          </motion.div>
                        </div>
                        
                        <p className="text-lg text-slate-600 leading-relaxed font-light max-w-2xl">
                          {currentPartner.fullDescription}
                        </p>
                      </div>

                      {/* Enhanced Stats Grid */}
                      <div className="grid grid-cols-3 gap-6">
                        {Object.entries(currentPartner.stats).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <div className={`w-3 h-3 bg-${currentPartner.accentColor}-500 rounded-full mx-auto mb-2`}></div>
                            <div className="font-bold text-slate-900 text-lg">{value}</div>
                            <div className="text-slate-500 text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Slide Indicators */}
            <div className="flex justify-center mt-8 gap-3">
              {primaryPartners.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? `bg-${currentPartner.accentColor}-500 scale-125` 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Trust Metrics */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {[
            { number: "130M+", label: "Choices Simplified", icon: "📦" },
            { number: "98%", label: "User Satisfaction Rate", icon: "🎯" },
            { number: "Real-time", label: "AI Recommendations", icon: "🤖" },
            { number: "Favorites", label: "Marketplace Partners", icon: "🤝" }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              className="text-center p-6 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500"
              whileHover={{ y: -6, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="text-2xl mb-3">{metric.icon}</div>
              <div className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-2">
                {metric.number}
              </div>
              <div className="text-slate-600 font-medium text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium CTA */}
        <motion.div
          className="text-center mt-24 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleStartShopping}
            className="group relative px-12 py-5 text-xl font-bold rounded-full overflow-hidden"
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <span className="relative text-white flex items-center justify-center gap-4 tracking-wide">
              Start Shopping with AI
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

        {/* Updated Vision Board Interface Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-7xl"
        >
          <motion.div
            style={{
              transformPerspective: 1200,
            }}
            className="relative"
          >
            {/* Main Vision Board Interface Card */}
            <div className="bg-white/60 backdrop-blur-xl border border-slate-200/20 rounded-3xl shadow-2xl shadow-slate-900/10 p-1 overflow-hidden">
              <div className="bg-gradient-to-br from-slate-50/50 to-white/50 rounded-[20px] p-8">

                {/* Vision Board Interface Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                  
                  {/* Updated Sidebar - Moderately wider for better text fitting */}
                  <div className="lg:col-span-2">
                    <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl p-6 shadow-xl shadow-slate-900/5">
                      {/* Header with heart icon - updated to match Filters styling */}
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <h3 className="font-semibold text-slate-900 text-base">Liked Products</h3>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200">4</span>
                      </div>

                      {/* Search - exact match */}
                      <div className="relative mb-4">
                        <div className="relative group">
                          <input 
                            type="text" 
                            placeholder="Search your liked products..." 
                            className="w-full pl-10 pr-10 py-3 border border-slate-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm"
                          />
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* All Projects Dropdown - exact match */}
                      <div className="relative mb-6">
                        <div className="relative group">
                          <select className="w-full pl-10 pr-8 py-3 border border-slate-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm appearance-none cursor-pointer">
                            <option>All Projects</option>
                            <option>Living Room</option>
                            <option>Bedroom</option>
                            <option>Kitchen</option>
                          </select>
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Products Count - exact match */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-slate-700 font-medium">4 products</span>
                        </div>
                      </div>

                      {/* Your Collection Header - exact match */}
                      <div className="mb-4 text-sm font-medium text-slate-900 border-l-2 border-slate-400 pl-3">
                        Your Collection
                      </div>
                      
                      {/* Product Grid - constrained to show exactly 2 products */}
                      <div className="max-h-[32rem] overflow-hidden mb-6">
                        <div className="grid grid-cols-1 gap-4 hide-scrollbar">
                          {/* Product 1 - Modern Living Room Cushion (original data) */}
                          <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="relative h-32 overflow-hidden">
                              <img 
                                src="/images/front-table.jpg"
                                alt="Modern Living Room Cushion"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
                                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-slate-900 text-sm mb-1 line-clamp-2">
                                Modern Living Room Cushion, Velvet Cou...
                              </h4>
                              <div className="text-xs text-slate-500 mb-1">Design Project 2</div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-sm">$189</span>
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold border border-blue-200 hover:bg-blue-200 transition-colors duration-200">
                                  View
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Product 2 - Mid Century Three Piece Sectional (original data) */}
                          <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="relative h-32 overflow-hidden">
                              <img 
                                src="/images/plant-hanger.jpg"
                                alt="Mid Century Three Piece Sectional Sofa"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
                                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-slate-900 text-sm mb-1 line-clamp-2">
                                Mid Century Three Piece Sectional Sofa
                              </h4>
                              <div className="text-xs text-slate-500 mb-1">Design Project 2</div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-sm">$1,299</span>
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold border border-blue-200 hover:bg-blue-200 transition-colors duration-200">
                                  View
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Product 3 - Leather Sectional Couch (original data) */}
                          <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="relative h-32 overflow-hidden">
                              <img 
                                src="/images/sectional-sofa.jpg"
                                alt="Leather Sectional Couch"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
                                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-slate-900 text-sm mb-1 line-clamp-2">
                                Leather Sectional Couch with Ottoman...
                              </h4>
                              <div className="text-xs text-slate-500 mb-1">Design Project 2</div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-sm">$899</span>
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold border border-blue-200 hover:bg-blue-200 transition-colors duration-200">
                                  View
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Product 4 - HULALA HOME Modular Sectional (original data) */}
                          <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="relative h-32 overflow-hidden">
                              <img 
                                src="/images/leather-sofa.jpg"
                                alt="HULALA HOME Modular Sectional"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
                                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-slate-900 text-sm mb-1 line-clamp-2">
                                HULALA HOME 127" Modular Sectional...
                              </h4>
                              <div className="text-xs text-slate-500 mb-1">Design Project 2</div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-sm">$1,569</span>
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold border border-blue-200 hover:bg-blue-200 transition-colors duration-200">
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Select More Favorites Button - updated styling */}
                      <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-600 hover:text-slate-800 transition-colors duration-200 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200">
                        <div className="w-4 h-4 text-red-500">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                          </svg>
                        </div>
                        <span>Select more favorites</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Vision Board Canvas - Adjusted for moderately wider sidebar */}
                  <div className="lg:col-span-5">
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-900/5 overflow-hidden h-full">
                      <div className="p-6 border-b border-slate-200/60">
                        <div className="flex items-center gap-4">
                          <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full"></div>
                          <h3 className="font-light text-3xl text-slate-900">
                            Your <span className="font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Vision Board</span>
                          </h3>
                          <span className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold border border-violet-200">
                            4
                          </span>
                        </div>
                      </div>
                      
                      {/* Canvas Area - Extended height to accommodate moved items */}
                      <div className="relative bg-gradient-to-br from-slate-50/50 to-white/50 overflow-hidden flex items-center justify-center" style={{ height: '780px' }}>
                        {/* Vision Board Items - All 4 items restored */}
                        <div className="relative" style={{ width: '450px', height: '340px', marginTop: '40px' }}>
                          {/* Top row - 2 items */}
                          
                          {/* HULALA HOME - Top Left with purple price tag */}
                          <motion.div 
                            className="absolute bg-white/95 rounded-xl shadow-lg overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing group"
                            style={{ 
                              left: '5px', 
                              top: '-10px',
                              width: '190px',
                              height: '140px'
                            }}
                            drag
                            dragMomentum={false}
                            dragElastic={0.1}
                            whileDrag={{ scale: 1.05, zIndex: 50, rotateZ: 2 }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0, duration: 0.5 }}
                          >
                            {/* Purple price tag */}
                            <div className="absolute -top-8 left-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap shadow-lg">
                              HULALA HOME 127" Modular Sect... - $1,569
                            </div>
                            
                            {/* Close button - only visible on hover */}
                            <button 
                              onClick={() => removeVisionBoardItem(1)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                            >
                              ×
                            </button>
                            
                            <img 
                              src="/images/leather-sofa.jpg"
                              alt="HULALA HOME Modular Sectional"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          </motion.div>
                          
                          {/* Leather Sectional - Top Right */}
                          <motion.div 
                            className="absolute bg-white/95 rounded-xl shadow-lg overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing group"
                            style={{ 
                              left: '255px', 
                              top: '-10px',
                              width: '190px',
                              height: '140px'
                            }}
                            drag
                            dragMomentum={false}
                            dragElastic={0.1}
                            whileDrag={{ scale: 1.05, zIndex: 50, rotateZ: 2 }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            {/* Close button - only visible on hover */}
                            <button 
                              onClick={() => removeVisionBoardItem(2)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                            >
                              ×
                            </button>
                            
                            <img 
                              src="/images/sectional-sofa.jpg"
                              alt="Leather Sectional Couch"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          </motion.div>

                          {/* Bottom row - 2 items */}
                          
                          {/* Modern Living Room - Bottom Left */}
                          <motion.div 
                            className="absolute bg-white/95 rounded-xl shadow-lg overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing group"
                            style={{ 
                              left: '5px', 
                              top: '170px',
                              width: '190px',
                              height: '140px'
                            }}
                            drag
                            dragMomentum={false}
                            dragElastic={0.1}
                            whileDrag={{ scale: 1.05, zIndex: 50, rotateZ: 2 }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            {/* Close button - only visible on hover */}
                            <button 
                              onClick={() => removeVisionBoardItem(3)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                            >
                              ×
                            </button>
                            
                            <img 
                              src="/images/front-table.jpg"
                              alt="Modern Living Room Cushion"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          </motion.div>
                          
                          {/* Mid Century Three Piece - Bottom Right */}
                          <motion.div 
                            className="absolute bg-white/95 rounded-xl shadow-lg overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing group"
                            style={{ 
                              left: '255px', 
                              top: '170px',
                              width: '190px',
                              height: '140px'
                            }}
                            drag
                            dragMomentum={false}
                            dragElastic={0.1}
                            whileDrag={{ scale: 1.05, zIndex: 50, rotateZ: 2 }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                          >
                            {/* Close button - only visible on hover */}
                            <button 
                              onClick={() => removeVisionBoardItem(4)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                            >
                              ×
                            </button>
                            
                            <img 
                              src="/images/plant-hanger.jpg"
                              alt="Mid Century Three Piece Sectional"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          </motion.div>
                        </div>

                        {/* Interactive helper text - moved to bottom center */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-slate-500 text-xs bg-white/80 px-3 py-2 rounded-lg backdrop-blur-sm border border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <span>🖱️ Drag items to rearrange</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            <span>Dot grid snapping enabled</span>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default TrustedBrands;