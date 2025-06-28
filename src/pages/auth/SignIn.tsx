import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Sparkles, Zap, Palette } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../utils/constants';

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const features = [
    "AI-Powered Design Analysis",
    "Instant Product Matching", 
    "Smart Vision Boards",
    "One-Click Shopping"
  ];

  // Initialize animations
  useEffect(() => {
    setIsLoaded(true);
    
    // Feature text cycling
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle responsive display for left panel
  useEffect(() => {
    const checkScreenSize = () => {
      setShowLeftPanel(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value && value.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const getErrorMessage = (error: any) => {
    // Handle specific Supabase auth errors
    if (error?.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
        return 'The email or password you entered is incorrect. Please check your credentials and try again.';
      }
      
      if (message.includes('email not confirmed')) {
        return 'Please check your email and click the confirmation link before signing in.';
      }
      
      if (message.includes('too many requests')) {
        return 'Too many login attempts. Please wait a few minutes before trying again.';
      }
      
      if (message.includes('user not found')) {
        return 'No account found with this email address. Please check your email or create a new account.';
      }
      
      if (message.includes('network')) {
        return 'Network error. Please check your internet connection and try again.';
      }
      
      // Return the original error message if it's user-friendly
      if (error.message.length < 100) {
        return error.message;
      }
    }
    
    // Default fallback message
    return 'Sign in failed. Please check your credentials and try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
      await login(email, password, rememberMe);
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/studio';
        navigate(from, { replace: true });
      }, 100);
      
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ general: getErrorMessage(error) });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      // In a real app, you would use Google OAuth SDK here
      setTimeout(() => {
        setIsGoogleLoading(false);
        console.log('Google sign in successful');
        navigate('/studio');
      }, 2000);
      
    } catch (error) {
      setIsGoogleLoading(false);
      console.error('Google sign in failed:', error);
    }
  };

  const isFormValid = email && password && !errors.email && !errors.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative overflow-hidden">
      
      {/* Enhanced Background Elements - Similar to Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated geometric pattern matching hero */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="signin-premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="2" 
                  fill="#8b5cf6"
                  opacity="0.4"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.2;0.8;0.2" 
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
                  opacity="0.3"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.1;0.7;0.1" 
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
                  opacity="0.4"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.2;0.9;0.2" 
                    dur="5s" 
                    repeatCount="indefinite"
                    begin="2s"
                  />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#signin-premium-grid)" />
          </svg>
        </div>

        {/* Premium floating elements matching hero */}
        <motion.div
          className="absolute top-1/4 right-1/5 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/6 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-cyan-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left Side - Enhanced Branding */}
      <motion.div 
        className="lg:w-1/2 relative z-10 flex-col justify-center pl-8 pr-12 lg:pl-12 lg:pr-12 xl:pl-16 xl:pr-16"
        style={{ display: showLeftPanel ? 'flex' : 'none' }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: showLeftPanel ? 1 : 0, x: showLeftPanel ? 0 : -50 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-lg ml-auto text-white">
          {/* Premium Status Badge - matching hero */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: showLeftPanel ? 1 : 0, y: showLeftPanel ? 0 : -30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
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
                  Welcome back to MDI Design Studio
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl xl:text-5xl font-black leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showLeftPanel ? 1 : 0, y: showLeftPanel ? 0 : 30 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-white block mb-2">
              Continue Your
            </span>
            <span className="block font-[900] bg-gradient-to-r from-violet-400 via-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent bg-[length:400%_100%]"
                  style={{
                    WebkitTextStroke: '1px transparent',
                    textShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                  }}>
              Design Journey
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/90 leading-relaxed mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showLeftPanel ? 1 : 0, y: showLeftPanel ? 0 : 20 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Access your saved projects, vision boards, and curated product recommendations. Transform inspiration into reality.
          </motion.p>

          {/* Dynamic Feature Cycling - Similar to Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showLeftPanel ? 1 : 0, y: showLeftPanel ? 0 : 20 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-violet-400" size={20} />
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">Featured Capabilities</span>
            </div>
            
            <div className="relative overflow-hidden" style={{ height: '2em' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatureIndex}
                  className="absolute inset-0 flex items-center"
                  initial={{ 
                    opacity: 0,
                    y: 50,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0,
                    y: -50,
                    scale: 0.8
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.165, 0.84, 0.44, 1]
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-2xl font-semibold text-white">
                      {features[currentFeatureIndex]}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showLeftPanel ? 1 : 0, y: showLeftPanel ? 0 : 20 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {[
              { metric: "2.1s", label: "Avg Processing" },
              { metric: "AI-Powered", label: "Smart Matching" },
              { metric: "Instant", label: "Results" }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: showLeftPanel ? 1 : 0, 
                  scale: showLeftPanel ? 1 : 0.8 
                }}
                transition={{ 
                  delay: 1.3 + (index * 0.1), 
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                <div className="text-2xl font-black text-white">{stat.metric}</div>
                <div className="text-xs text-white/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Enhanced Form */}
      <motion.div 
        className="flex items-center justify-center px-6 lg:px-12 xl:px-16 relative z-10"
        style={{ width: showLeftPanel ? '50%' : '100%' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          <motion.div
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-slate-900/20 p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Link to="/" className="inline-block mb-4">
                    <h1 className="font-black text-3xl text-white mb-2 tracking-tight">{APP_NAME}</h1>
                  </Link>
                  <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full mx-auto mb-4"></div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <h2 className="text-2xl font-light text-white mb-2">Welcome back</h2>
                </motion.div>
              </div>

              {/* Error Message */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 text-sm font-medium mb-1">Sign in failed</p>
                      <p className="text-red-200/80 text-sm leading-relaxed">{errors.general}</p>
                      {errors.general.includes('incorrect') && (
                        <div className="mt-2 text-xs text-red-200/70">
                          <p>• Double-check your email address for typos</p>
                          <p>• Make sure your password is correct</p>
                          <p>• Use "Forgot password?" if you need to reset it</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Google Sign In */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <motion.button 
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 group disabled:opacity-50 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span className="font-medium text-white group-hover:text-white/90">
                    {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </motion.button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-900 text-white/60 font-medium">or</span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-white/40 text-sm font-medium ${
                        errors.email 
                          ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                          : email && !errors.email
                          ? 'border-emerald-400/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-white/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'
                      }`}
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    {email && !errors.email && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {errors.email && (
                      <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400" size={18} />
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-300">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-white/40 text-sm font-medium ${
                        errors.password 
                          ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                          : password && !errors.password
                          ? 'border-emerald-400/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-white/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'
                      }`}
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-300">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-violet-500 bg-white/10 border-white/30 rounded focus:ring-violet-400 focus:ring-2" 
                    />
                    <span className="ml-2 text-sm text-white/80 font-medium">Remember me</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                    onClick={(e) => {
                      console.log('Navigating to forgot password...');
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`group relative w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                    isFormValid && !loading
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-2xl hover:shadow-violet-500/25 transform hover:-translate-y-1'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                  whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
                  whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                >
                  {/* Animated background for button */}
                  {isFormValid && !loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                  {isFormValid && !loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  )}
                  
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="tracking-wide">Sign in to Studio</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight size={18} />
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.form>

              {/* Footer */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <p className="text-white/70 font-light text-sm">
                  New to {APP_NAME}?{' '}
                  <Link 
                    to="/signup" 
                    className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline decoration-violet-400/30 hover:decoration-violet-300/50"
                    onClick={(e) => {
                      console.log('Navigating to signup...');
                    }}
                  >
                    Create account
                  </Link>
                </p>
              </motion.div>


            </div>
          </motion.div>


        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;