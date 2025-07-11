import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, CreditCard, Calendar, AlertCircle, ArrowLeft, Loader2, User, Settings, Crown, Zap, Shield, Star, Edit2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { StripeService } from '../services/stripeService';
import { supabase } from '../lib/supabase';
import { ApiUsageService, ApiUsage } from '../services/apiUsageService';
import WhiteLabelSettings from '../components/account/WhiteLabelSettings';
import AccountUsageLimits from '../components/account/AccountUsageLimits';

const Account: React.FC = () => {
  const { user } = useAuth();
  const { subscription, refreshSubscription, isLoading, limits } = useSubscription();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [apiUsage, setApiUsage] = useState<ApiUsage | null>(null);
  const [isLoadingApiUsage, setIsLoadingApiUsage] = useState(false);
  const [visionBoardCount, setVisionBoardCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const features = [
    "Your Design Hub",
    "Creative Control Center",
    "Design Management",
    "Account Dashboard"
  ];

  // Initialize animations and feature cycling
  useEffect(() => {
    setIsLoaded(true);
    
    // Feature text cycling
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Check for success parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const plan = params.get('plan');
    
    if (success === 'true' && plan) {
      setShowSuccessMessage(true);
      refreshSubscription();
      
      // Clear the URL parameters after a delay
      const timeout = setTimeout(() => {
        navigate('/account', { replace: true });
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [location, navigate, refreshSubscription]);

  // Set initial name values when user data loads
  useEffect(() => {
    if (user?.user_metadata) {
      setFirstName(user.user_metadata.first_name || '');
      setLastName(user.user_metadata.last_name || '');
    }
  }, [user]);

  // Load API usage data and project/vision board counts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingApiUsage(true);
        
        // Load API usage data
        const usage = await ApiUsageService.getUserApiUsage();
        setApiUsage(usage);
        
        // Load project count
        const { count: projectCountResult, error: projectError } = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true });
        
        if (!projectError) {
          setProjectCount(projectCountResult || 0);
        }
        
        // Load vision board count
        const { count: visionBoardCountResult, error: visionBoardError } = await supabase
          .from('vision_boards')
          .select('id', { count: 'exact', head: true })
          .eq('is_saved', true);
        
        if (!visionBoardError) {
          setVisionBoardCount(visionBoardCountResult || 0);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
      } finally {
        setIsLoadingApiUsage(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoadingPortal(true);
      const portalUrl = await StripeService.getCustomerPortalUrl(window.location.origin + '/account');
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      setUpdateError('');
      setUpdateSuccess(false);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName
        }
      });
      
      if (error) {
        throw error;
      }
      
      setUpdateSuccess(true);
      setIsEditingName(false);
      
      // Clear success message after a delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const getPlanIcon = () => {
    switch (subscription.tier) {
      case 'studio':
        return <Crown className="w-8 h-8" />;
      case 'pro':
        return <Zap className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getPlanGradient = () => {
    switch (subscription.tier) {
      case 'studio':
        return 'from-blue-600 to-blue-700';
      case 'pro':
        return 'from-violet-600 to-purple-600';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const getPlanColor = () => {
    switch (subscription.tier) {
      case 'studio':
        return 'text-blue-600';
      case 'pro':
        return 'text-violet-600';
      default:
        return 'text-slate-600';
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-violet-200/40 to-purple-200/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Enhanced Hero Section */}
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
                <pattern id="account-premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
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
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#account-premium-grid)" />
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
          <motion.div 
            className="max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Back Button */}
            <motion.div 
              className="flex mb-8"
              variants={itemVariants}
            >
              <div className="group relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-emerald-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                
                <button 
                  onClick={() => navigate('/studio')}
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
                </button>
              </div>
            </motion.div>

            {/* Enhanced Main Title */}
            <motion.h1 
              variants={itemVariants}
              className="font-black text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 leading-[0.9] tracking-tight"
            >
              <span className="text-white block mb-2">
                Account
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
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl font-light mb-10"
            >
              Manage your profile, subscription, and preferences. Keep track of your usage 
              and billing information all in one place.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Success Messages */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-emerald-800">Subscription Activated!</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Thank you for your purchase. Your subscription has been activated successfully.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {updateSuccess && (
          <motion.div
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-emerald-800">Profile Updated!</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Your profile information has been updated successfully.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile & Subscription */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Enhanced User Profile Section */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -2 }}
            >
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Information</h2>
                  <p className="text-slate-600">Your account details and personal information</p>
                </div>
                <motion.button
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="p-3 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-2xl transition-all duration-200 group"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 size={20} className="group-hover:rotate-12 transition-transform duration-200" />
                </motion.button>
              </div>

              <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-slate-50 to-violet-50/30 rounded-3xl border border-slate-100">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-violet-500 to-blue-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {user?.user_metadata?.first_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </h3>
                  <p className="text-slate-600 text-lg mb-2">{user?.email}</p>
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm text-emerald-600 font-medium">Active Account</span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isEditingName ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
                        placeholder="Enter your last name"
                      />
                    </div>
                    
                    {updateError && (
                      <motion.div 
                        className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {updateError}
                      </motion.div>
                    )}
                    
                    <div className="col-span-2 flex gap-3 mt-2">
                      <motion.button
                        onClick={() => setIsEditingName(false)}
                        className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isUpdatingProfile}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleUpdateProfile}
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Check size={18} />
                            <span>Save Changes</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Enhanced Subscription Details Section */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
                      <p className="text-slate-600">Loading subscription details...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div 
                      className="p-6 bg-gradient-to-r from-slate-50 to-violet-50/30 rounded-3xl mb-8 border border-slate-100"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getPlanIcon() && (
                            <div className={`w-12 h-12 bg-gradient-to-r ${getPlanGradient()} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                              {getPlanIcon()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Current Plan</h4>
                            <p className={`text-2xl font-bold ${getPlanColor()}`}>
                              {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
                            </p>
                          </div>
                        </div>
                        
                        {subscription.tier !== 'free' && (
                          <div className="text-right">
                            <p className="text-sm text-slate-600 mb-1">Next billing date</p>
                            <p className="font-semibold text-slate-900">
                              {formatDate(subscription.currentPeriodEnd)}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {subscription.tier !== 'free' && (
                      <>
                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-4">
                            <CreditCard size={20} className="text-slate-500" />
                            <h5 className="font-semibold text-slate-900">Payment Method</h5>
                          </div>
                          
                          {subscription.paymentMethod?.brand ? (
                            <motion.div 
                              className="p-4 bg-slate-50 rounded-2xl border border-slate-200"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                  {subscription.paymentMethod.brand.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {subscription.paymentMethod.brand.charAt(0).toUpperCase() + subscription.paymentMethod.brand.slice(1)} •••• {subscription.paymentMethod.last4}
                                  </p>
                                  <p className="text-sm text-slate-600">Default payment method</p>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              className="p-4 bg-amber-50 border border-amber-200 rounded-2xl"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <p className="font-medium text-amber-800">No payment method on file</p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar size={20} className="text-slate-500" />
                            <h5 className="font-semibold text-slate-900">Billing Information</h5>
                          </div>
                          
                          <motion.div 
                            className="p-4 bg-slate-50 rounded-2xl border border-slate-200"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-slate-700">
                              {subscription.cancelAtPeriodEnd 
                                ? `⚠️ Your subscription will end on ${formatDate(subscription.currentPeriodEnd)}`
                                : `✅ Your subscription will automatically renew on ${formatDate(subscription.currentPeriodEnd)}`
                              }
                            </p>
                          </motion.div>
                        </div>
                      </>
                    )}

                    {subscription.tier !== 'free' && (
                      <div className="flex flex-wrap gap-4">
                        <motion.button
                          onClick={handleManageSubscription}
                          disabled={isLoadingPortal}
                          className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-semibold hover:from-slate-800 hover:to-slate-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl"
                          whileHover={{ scale: isLoadingPortal ? 1 : 1.02, y: -2 }}
                          whileTap={{ scale: isLoadingPortal ? 1 : 0.98 }}
                        >
                          {isLoadingPortal ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <Settings size={20} />
                              <span>Manage Subscription</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* White Label Settings - Only for Studio Plan */}
            {subscription.tier === 'studio' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <WhiteLabelSettings userId={user?.id || ''} />
              </motion.div>
            )}
          </div>

          {/* Right Column - Usage Limits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AccountUsageLimits 
              apiUsage={apiUsage}
              isLoading={isLoadingApiUsage}
              projectCount={projectCount}
              visionBoardCount={visionBoardCount}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;