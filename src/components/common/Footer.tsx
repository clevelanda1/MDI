import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_NAME } from '../../utils/constants';

const Footer: React.FC = () => {
  const [logoColorStates] = useState([0, 1, 2, 3]); // Static color states for each dot
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced scroll transforms
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Updated color gradients - changed 4th gradient from slate to green
  const colorGradients = [
    { id: 'footer-gradient1', colors: ['#8b5cf6', '#a855f7'] }, // Violet
    { id: 'footer-gradient2', colors: ['#3b82f6', '#2563eb'] }, // Blue
    { id: 'footer-gradient3', colors: ['#7c3aed', '#6d28d9'] }, // Purple
    { id: 'footer-gradient4', colors: ['#10b981', '#059669'] }, // Green (changed from slate)
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        ease: [0.165, 0.84, 0.44, 1]
      }
    }
  };

  const socialIcons = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  const legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" }
  ];

  return (
    <footer 
      ref={containerRef}
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
    >
      {/* Premium Background Elements - Consistent with Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated geometric pattern */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footer-premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#footer-premium-grid)" />
          </svg>
        </div>

        {/* Premium floating elements - matching Hero style */}
        <motion.div
          className="absolute top-1/4 right-1/6 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/6 via-blue-500/3 to-purple-500/6 rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/5 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/5 via-teal-500/2 to-cyan-500/5 rounded-full blur-3xl"
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
        className="relative z-10 py-24"
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Brand Column - With Enhanced Animated Logo */}
            <motion.div variants={itemVariants}>
              {/* Premium Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
                className="flex justify-start mb-8"
              >
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                  
                  <div className="relative inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-lg hover:shadow-xl transition-all duration-700">
                    <div className="relative flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-emerald-300 rounded-full animate-ping"></div>
                    </div>
                    
                    <span className="text-white/90 text-xs font-bold tracking-wide">
                      Powered by AI
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Logo with 4 dots - Enhanced with green bottom-right dot */}
              <div className="flex items-center gap-4 mb-8">
                <motion.div 
                  className="relative w-10 h-10"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 32 32" className="w-full h-full">
                    {/* Enhanced Glow effects behind each circle - updated for green */}
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

                    {/* Main circles on top - Enhanced */}
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
                
                <motion.h2 
                  className="font-[900] text-3xl text-white bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_100%]"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    backgroundPosition: { 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }
                  }}
                  style={{
                    WebkitTextStroke: '1px transparent',
                    textShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  {APP_NAME}
                </motion.h2>
              </div>
              
              <motion.div
                className="w-20 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 mb-8 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
                viewport={{ once: true }}
              />
              
              <p className="text-white/80 leading-relaxed mb-10 text-xl font-light max-w-xl">
                Turn any room photo into your perfect space. Get smart product recommendations and create beautiful vision boards in seconds.
              </p>
              
              <div className="flex space-x-4">
                {socialIcons.map(({ icon: Icon, href, label }, index) => (
                  <motion.a 
                    key={label}
                    href={href} 
                    className="p-4 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 group border border-white/10 hover:border-white/20"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ transitionDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Resources */}
            <motion.div variants={itemVariants} className="space-y-10">
              {/* Resources Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.165, 0.84, 0.44, 1] }}
                className="flex justify-start mb-8"
              >
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                  
                  <div className="relative inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-lg hover:shadow-xl transition-all duration-700">
                    <div className="relative flex items-center">
                      <div className="w-2 h-2 bg-violet-500 rounded-full shadow-lg"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-violet-400 rounded-full animate-ping"></div>
                    </div>
                    
                    <span className="text-white/90 text-xs font-bold tracking-wide">
                      Resources
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Design Stories Blog Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ ease: [0.165, 0.84, 0.44, 1], duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Link 
                  to="/blog" 
                  className="text-white/70 hover:text-white transition-all duration-300 flex items-center group font-medium text-xl"
                >
                  <motion.span
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  >
                    Design Blogs
                  </motion.span>
                  <ArrowRight 
                    size={18} 
                    className="ml-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0" 
                  />
                </Link>
                <p className="text-white/50 text-base mt-3 font-light leading-relaxed">
                  Get inspired by real transformations and discover products that make the difference.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Newsletter Signup - Matching Hero Interface Style */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 mb-16 shadow-2xl shadow-slate-900/20"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
            viewport={{ once: true }}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-bold text-3xl text-white mb-3 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Stay Inspired
                </h3>
                <p className="text-white/70 font-light text-lg leading-relaxed">
                  Get design tips, product recommendations, and room makeover ideas delivered weekly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300 lg:w-72 text-base"
                />
                <motion.button
                  className="group relative px-10 py-4 text-lg font-bold rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <span className="relative text-white flex items-center justify-center gap-3 tracking-wide">
                    Subscribe
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Bottom Bar */}
          <motion.div 
            className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
            viewport={{ once: true }}
          >
            <p className="text-white/50 text-base font-medium">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <motion.div
              className="flex items-center gap-2 text-white/40 text-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>AI-Powered Design Platform</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;