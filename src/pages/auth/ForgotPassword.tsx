import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Clock, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{email?: string}>({});
  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setErrors({ email: 'Please enter a valid email address' });
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setResendCount(1);
    }, 2000);
  };

  const handleResend = () => {
    setIsLoading(true);
    setResendCount(prev => prev + 1);
    setCountdown(60); // 60 second cooldown
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setResendCount(0);
    setCountdown(0);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Enhanced Background Elements - Matching SignIn */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated geometric pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="forgot-premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#forgot-premium-grid)" />
          </svg>
        </div>

        {/* Premium floating elements */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-cyan-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 40, 0],
            rotate: [360, 240, 120, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <motion.div
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-slate-900/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      <Link to="/" className="inline-block mb-2">
                        <h1 className="font-black text-3xl text-white mb-2 tracking-tight">{APP_NAME}</h1>
                      </Link>
                      <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full mx-auto mb-6"></div>
                      <h2 className="text-2xl font-light text-white mb-2">Reset your password</h2>
                      <p className="text-white/70 font-light text-sm leading-relaxed">
                        Enter your email address and we'll send you a secure link to reset your password
                      </p>
                    </motion.div>
                  </div>

                  {/* Form */}
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Email address</label>
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
                          placeholder="Enter your email address"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                        {email && !errors.email && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <motion.p 
                          className="mt-2 text-sm text-red-300"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={!email || !!errors.email || isLoading}
                      className={`group relative w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                        email && !errors.email && !isLoading
                          ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-2xl hover:shadow-violet-500/25 transform hover:-translate-y-1'
                          : 'bg-white/10 text-white/40 cursor-not-allowed'
                      }`}
                      whileHover={email && !errors.email && !isLoading ? { scale: 1.02 } : {}}
                      whileTap={email && !errors.email && !isLoading ? { scale: 0.98 } : {}}
                    >
                      {/* Animated background for button */}
                      {email && !errors.email && !isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      )}
                      {email && !errors.email && !isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      )}
                      
                      <div className="relative flex items-center justify-center gap-3">
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="tracking-wide">Send reset link</span>
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

                  {/* Help Text */}
                  <motion.div 
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    <p className="text-sm text-white/70">
                      Remember your password?{' '}
                      <Link to="/signin" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline decoration-violet-400/30 hover:decoration-violet-300/50">
                        Sign in instead
                      </Link>
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  {/* Success Icon */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative inline-block mb-6"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle className="text-white" size={28} />
                    </div>
                    <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-2xl blur-lg opacity-50"></div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <h2 className="text-2xl font-light text-white mb-2">Check your email</h2>
                    <p className="text-white/70 font-light mb-4 text-sm leading-relaxed">
                      We've sent a password reset link to
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                      <p className="font-semibold text-white text-sm">{email}</p>
                    </div>
                  </motion.div>

                  {/* Enhanced Instructions */}
                  <motion.div 
                    className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-5 mb-6 text-left border border-blue-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="text-blue-400" size={16} />
                      <h3 className="font-semibold text-white text-sm">Next steps:</h3>
                    </div>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Check your email inbox (and spam folder)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Click the reset link within 15 minutes</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Create a new secure password</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Resend Section */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <p className="text-xs text-white/60">
                      Didn't receive the email?
                    </p>
                    
                    {countdown > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-white/60">
                        <Clock size={14} />
                        <span className="text-xs font-medium">
                          You can resend in {countdown} seconds
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button 
                          onClick={handleResend}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/15 transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <RefreshCw size={14} />
                          )}
                          <span>
                            {resendCount > 1 ? `Resend again` : 'Resend email'}
                          </span>
                        </motion.button>
                        
                        <motion.button
                          onClick={handleTryAgain}
                          className="flex-1 px-4 py-3 text-violet-400 hover:text-violet-300 font-semibold transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Try different email
                        </motion.button>
                      </div>
                    )}
                  </motion.div>

                  {/* Back to Sign In */}
                  <motion.div 
                    className="mt-8 pt-6 border-t border-white/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <Link
                      to="/signin"
                      className="inline-flex items-center text-white/70 hover:text-white font-medium transition-colors group text-sm"
                    >
                      <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                      Back to sign in
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Security Notice */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
            <Shield size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Secure password reset</span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
            Reset links expire after 15 minutes for your security. 
            We'll never ask for your password via email.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;