import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, AlertCircle, Zap, Palette, CheckCircle } from 'lucide-react';

// Mock auth context for demo
const useAuth = () => ({
  register: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (data.email === 'test@example.com') {
      throw new Error('Email already exists');
    }
    return true;
  },
  loading: false
});

const APP_NAME = 'MDI Design Studio';

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState(1);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const { register, loading } = useAuth();

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

  // Handle responsive display for right panel
  useEffect(() => {
    const checkScreenSize = () => {
      setShowRightPanel(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };
    return requirements;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        const requirements = validatePassword(value);
        if (value && !Object.values(requirements).every(req => req)) {
          newErrors.password = 'Password must meet all requirements';
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case 'firstName':
        if (value && value.length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (value && value.length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete newErrors.lastName;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    
    try {
      // In a real app, you would use Google OAuth SDK here
      setTimeout(() => {
        setIsGoogleLoading(false);
        console.log('Google sign up successful');
        navigate('/studio');
      }, 2000);
      
    } catch (error) {
      setIsGoogleLoading(false);
      console.error('Google sign up failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate step 1
      const newErrors: {[key: string]: string} = {};
      
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      setStep(2);
      return;
    }
    
    // Final validation
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) newErrors.terms = 'You must accept the terms and conditions';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      navigate('/studio');
    } catch (error: any) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    }
  };

  const passwordRequirements = validatePassword(formData.password);
  const isStep1Valid = formData.firstName && formData.lastName && formData.email && !errors.firstName && !errors.lastName && !errors.email;
  const isStep2Valid = formData.password && formData.confirmPassword && acceptTerms && !errors.password && !errors.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative overflow-hidden">
      
      {/* Enhanced Background Elements - Matching SignIn */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated geometric pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="signup-premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#signup-premium-grid)" />
          </svg>
        </div>

        {/* Premium floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            y: [0, 40, 0],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/6 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-cyan-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 50, 0],
            y: [0, -50, 0],
            rotate: [-360, -180, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left Side - Enhanced Form */}
      <motion.div 
        className="flex items-center justify-center px-6 lg:px-12 xl:px-16 relative z-10"
        style={{ width: showRightPanel ? '50%' : '100%' }}
        initial={{ opacity: 0, x: -50 }}
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
                  <h2 className="text-2xl font-light text-white mb-2">Create your account</h2>
                </motion.div>
              </div>

              {/* Progress Indicator */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-gradient-to-r from-violet-500 to-blue-500' : 'bg-white/20'}`}></div>
                  <div className={`flex-1 h-1.5 rounded-full ml-3 transition-all duration-500 ${step >= 2 ? 'bg-gradient-to-r from-violet-500 to-blue-500' : 'bg-white/20'}`}></div>
                </div>
                <p className="text-xs text-white/60 text-center font-medium">
                  Step {step} of 2: {step === 1 ? 'Personal Information' : 'Security Setup'}
                </p>
              </motion.div>

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
                      <p className="text-red-300 text-sm font-medium mb-1">Registration failed</p>
                      <p className="text-red-200/80 text-sm leading-relaxed">{errors.general}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Google Sign Up (Step 1 only) */}
              {step === 1 && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  <motion.button 
                    onClick={handleGoogleSignUp}
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
                      {isGoogleLoading ? 'Creating account...' : 'Sign up with Google'}
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
              )}

              {/* Enhanced Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step === 1 ? 1.3 : 0.5, duration: 0.6 }}
              >
                {step === 1 ? (
                  // Step 1: Personal Information
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">First name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-white/40 text-sm font-medium ${
                              errors.firstName 
                                ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                                : formData.firstName && !errors.firstName
                                ? 'border-emerald-400/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                                : 'border-white/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'
                            }`}
                            placeholder="John"
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                        </div>
                        {errors.firstName && (
                          <p className="mt-2 text-xs text-red-300">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Last name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-white/40 text-sm font-medium ${
                              errors.lastName 
                                ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                                : formData.lastName && !errors.lastName
                                ? 'border-emerald-400/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                                : 'border-white/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'
                            }`}
                            placeholder="Doe"
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                        </div>
                        {errors.lastName && (
                          <p className="mt-2 text-xs text-red-300">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Work email</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-white/40 text-sm font-medium ${
                            errors.email 
                              ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                              : formData.email && !errors.email
                              ? 'border-emerald-400/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                              : 'border-white/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'
                          }`}
                          placeholder="john@company.com"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                        {formData.email && !errors.email && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-xs text-red-300">{errors.email}</p>
                      )}
                    </div>
                  </>
                ) : (
                  // Step 2: Security Setup
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Create password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-white/40 text-sm font-medium ${
                            errors.password 
                              ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                              : formData.password && !errors.password
                              ? 'border-emerald-400/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                              : 'border-white/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'
                          }`}
                          placeholder="Create a strong password"
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
                      
                      {/* Enhanced Password Requirements */}
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full transition-colors ${passwordRequirements.length ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                          <span className={`font-medium ${passwordRequirements.length ? 'text-emerald-400' : 'text-white/50'}`}>8+ characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full transition-colors ${passwordRequirements.uppercase ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                          <span className={`font-medium ${passwordRequirements.uppercase ? 'text-emerald-400' : 'text-white/50'}`}>Uppercase</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full transition-colors ${passwordRequirements.lowercase ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                          <span className={`font-medium ${passwordRequirements.lowercase ? 'text-emerald-400' : 'text-white/50'}`}>Lowercase</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full transition-colors ${passwordRequirements.number ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                          <span className={`font-medium ${passwordRequirements.number ? 'text-emerald-400' : 'text-white/50'}`}>Number</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Confirm password</label>
                      <div className="relative">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-white/40 text-sm font-medium ${
                            errors.confirmPassword 
                              ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                              : formData.confirmPassword && !errors.confirmPassword
                              ? 'border-emerald-400/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                              : 'border-white/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                        {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-xs text-red-300">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="form-checkbox h-4 w-4 text-violet-500 bg-white/10 border-white/30 rounded focus:ring-violet-400 focus:ring-2 mt-0.5" 
                        />
                        <div className="text-xs text-white/80 leading-relaxed font-medium">
                          I agree to the{' '}
                          <Link to="/terms" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline decoration-violet-400/30 hover:decoration-violet-300/50">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline decoration-violet-400/30 hover:decoration-violet-300/50">
                            Privacy Policy
                          </Link>
                        </div>
                      </div>
                      {errors.terms && (
                        <p className="mt-2 text-xs text-red-300">{errors.terms}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  {step === 2 && (
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-white/20 rounded-2xl font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                  )}
                  
                  <motion.button
                    type="submit"
                    disabled={(step === 1 && !isStep1Valid) || (step === 2 && (!isStep2Valid || loading))}
                    className={`group relative ${step === 2 ? 'flex-1' : 'w-full'} py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                      ((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) && !loading
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-2xl hover:shadow-violet-500/25 transform hover:-translate-y-1'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                    whileHover={((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) && !loading ? { scale: 1.02 } : {}}
                    whileTap={((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) && !loading ? { scale: 0.98 } : {}}
                  >
                    {/* Animated background for button */}
                    {((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) && !loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}
                    {((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) && !loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                    
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : step === 1 ? (
                        <>
                          <span className="tracking-wide">Continue</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            →
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <span className="tracking-wide">Create Account</span>
                          <Sparkles size={18} />
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </motion.form>

              {/* Footer */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <p className="text-white/70 font-light text-sm">
                  Already have an account?{' '}
                  <Link 
                    to="/signin" 
                    className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline decoration-violet-400/30 hover:decoration-violet-300/50"
                    onClick={(e) => {
                      console.log('Navigating to signin...');
                    }}
                  >
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Enhanced Benefits */}
      <motion.div 
        className="lg:w-1/2 relative z-10 flex-col justify-center pl-8 pr-12 lg:pl-12 lg:pr-12 xl:pl-16 xl:pr-16"
        style={{ display: showRightPanel ? 'flex' : 'none' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: showRightPanel ? 1 : 0, x: showRightPanel ? 0 : 50 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-lg ml-auto text-white">
          {/* Premium Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: showRightPanel ? 1 : 0, y: showRightPanel ? 0 : -30 }}
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
                  No design experience needed
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl xl:text-5xl font-black leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showRightPanel ? 1 : 0, y: showRightPanel ? 0 : 30 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-white block mb-2">
              Upgrade Your
            </span>
            <span className="block font-[900] bg-gradient-to-r from-violet-400 via-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent bg-[length:400%_100%]"
                  style={{
                    WebkitTextStroke: '1px transparent',
                    textShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                  }}>
              Design Process
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/90 leading-relaxed mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showRightPanel ? 1 : 0, y: showRightPanel ? 0 : 20 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Transform any room design inspiration into an actionable, shoppable experience in moments, not months.
          </motion.p>

          {/* Dynamic Feature Cycling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showRightPanel ? 1 : 0, y: showRightPanel ? 0 : 20 }}
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
            animate={{ opacity: showRightPanel ? 1 : 0, y: showRightPanel ? 0 : 20 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {[
              { metric: "Free", label: "Forever" },
              { metric: "Instant", label: "Results" },
              { metric: "Premium", label: "Quality" }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: showRightPanel ? 1 : 0, 
                  scale: showRightPanel ? 1 : 0.8 
                }}
                transition={{ 
                  delay: 1.7 + (index * 0.1), 
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
    </div>
  );
};

export default SignUp;