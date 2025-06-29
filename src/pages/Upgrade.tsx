import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, Zap, Star, ArrowLeft, Sparkles, Users, Shield, Rocket, ChevronDown, ChevronUp, Gift, Loader2, AlertCircle, Upload, Search, ShoppingBag } from 'lucide-react';
import { STRIPE_PRODUCTS, SUBSCRIPTION_TIERS } from '../stripe-config';
import { StripeService } from '../services/stripeService';
import { useSubscription } from '../contexts/SubscriptionContext';
import PricingCard from '../components/common/PricingCard';

const Upgrade: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [hoveredFaq, setHoveredFaq] = useState<number | null>(null);
  
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  const features = [
    "Unlimited Creative Potential",
    "Advanced AI Design Analysis",
    "Priority Product Matching",
    "Premium Shopping Experience"
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
      setSuccessMessage(`Your ${plan.charAt(0).toUpperCase() + plan.slice(1)} subscription has been activated successfully!`);
      
      // Clear the URL parameters after a delay
      const timeout = setTimeout(() => {
        navigate('/upgrade', { replace: true });
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
    
    // Check for canceled parameter
    const canceled = params.get('canceled');
    if (canceled === 'true') {
      setErrorMessage('Checkout was canceled. Your subscription has not been changed.');
      
      // Clear the URL parameters after a delay
      const timeout = setTimeout(() => {
        navigate('/upgrade', { replace: true });
        setErrorMessage(null);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [location, navigate]);

  const getPrice = (plan: string) => {
    if (plan === 'pro') {
      return billingCycle === 'yearly' ? 15 : 19.99;
    } else if (plan === 'studio') {
      return billingCycle === 'yearly' ? 39 : 49.99;
    }
    return 0;
  };

  const getYearlySavings = (plan: string) => {
    if (plan === 'pro') {
      return ((19.99 - 15) * 12).toFixed(0);
    } else if (plan === 'studio') {
      return ((49.99 - 39) * 12).toFixed(0);
    }
    return '0';
  };

  const handleUpgrade = async (planId: string) => {
    try {
      setIsProcessing(true);
      setProcessingPlan(planId);
      setErrorMessage(null);
      
      // Get the Stripe product configuration based on billing cycle
      const productKey = billingCycle === 'yearly' 
        ? `${planId}Yearly` as keyof typeof STRIPE_PRODUCTS 
        : planId as keyof typeof STRIPE_PRODUCTS;
      
      const product = STRIPE_PRODUCTS[productKey];
      if (!product) {
        throw new Error(`Invalid plan: ${planId}`);
      }
      
      // Create a checkout session
      const { url } = await StripeService.createCheckoutSession({
        priceId: product.priceId,
        successUrl: `${window.location.origin}/account?success=true&plan=${planId}`,
        cancelUrl: `${window.location.origin}/upgrade?canceled=true`,
        mode: 'subscription'
      });
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
    } catch (error: any) {
      console.error('Error starting checkout:', error);
      setErrorMessage(error.message || 'Failed to start checkout process. Please try again.');
      setIsProcessing(false);
      setProcessingPlan(null);
    }
  };

  // Updated feature lists to match specifications
  const freeFeatures = [
    'AI Image analysis',
    '4 active projects',
    '40 Amazon searches/month',
    '25 Etsy searches/month',
    '1 active vision board'
  ];

  const proFeatures = [
    'Everything in Free',
    '25 active projects',
    '200 Amazon searches/month',
    '125 Etsy searches/month',
    'Custom search queries',
    '12 active vision boards',
    'Vision board sharing',
    'Ad-free experience'
  ];

  const studioFeatures = [
    'Everything in Pro',
    'Unlimited projects',
    '1,200 monthly Amazon search credits',
    '750 monthly Etsy search credits',
    'Unlimited vision boards',
    'White label branding'
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
                <pattern id="upgrade-premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
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
              <rect width="100%" height="100%" fill="url(#upgrade-premium-grid)" />
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
                
                <Link to="/studio" className="relative inline-flex items-center text-slate-300 hover:text-white transition-all duration-300 font-medium group bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full hover:bg-white/20">
                  <svg 
                    className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm">Back to Studio</span>
                </Link>
              </div>
            </motion.div>



            {/* Enhanced Main Title */}
            <motion.h1 
              variants={itemVariants}
              className="font-black text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 leading-[0.9] tracking-tight"
            >
              <span className="text-white block mb-2">
                Unlock Your
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
              Transform your design workflow with more projects, advanced AI features, 
              and priority support. Get started with no ads today!
            </motion.p>


          </motion.div>
        </div>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {(successMessage || errorMessage) && (
          <motion.div
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-4 rounded-xl shadow-lg ${
              successMessage ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {successMessage ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-800">{successMessage}</p>
                      <p className="text-sm text-emerald-600 mt-1">Redirecting you to the studio...</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="font-medium text-red-800">{errorMessage}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        {/* Billing Toggle */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Choose Your Plan</h2>
          <p className="text-slate-600 text-lg mb-8">Select the plan that works best for you and your design journey.</p>
          
          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center bg-white rounded-xl p-2 shadow-lg border border-slate-200">
            <motion.button
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setBillingCycle('monthly')}
              whileTap={{ scale: 0.95 }}
            >
              Monthly
            </motion.button>
            <motion.button
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative ${
                billingCycle === 'yearly'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setBillingCycle('yearly')}
              whileTap={{ scale: 0.95 }}
            >
              Yearly
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                20%
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Free Plan */}
          <PricingCard
            name="Free"
            price={0}
            period={billingCycle}
            description="Everything you need to get started"
            features={freeFeatures}
            isCurrentPlan={subscription.tier === 'free'}
            buttonText="Start Free - It's Free"
            onButtonClick={() => navigate('/studio')}
            colorClass="from-slate-600 to-slate-700"
            bgColorClass="from-slate-50 to-slate-100"
          />
          
          {/* Pro Plan */}
          <PricingCard
            name="Pro"
            price={billingCycle === 'yearly' ? 15 : 19.99}
            period={billingCycle}
            description="Everything you need to bring your vision to life"
            features={proFeatures}
            isPopular={true}
            isCurrentPlan={subscription.tier === 'pro'}
            buttonText={`Upgrade to Pro${billingCycle === 'yearly' ? '' : ''}`}
            onButtonClick={() => handleUpgrade('pro')}
            isLoading={isProcessing && processingPlan === 'pro'}
            colorClass="from-blue-600 to-blue-700"
            bgColorClass="from-blue-50 to-blue-50"
          />
          
          {/* Studio Plan */}
          <PricingCard
            name="Studio"
            price={billingCycle === 'yearly' ? 39 : 49.99}
            period={billingCycle}
            description="Built for teams that create without compromise"
            features={studioFeatures}
            isCurrentPlan={subscription.tier === 'studio'}
            buttonText={`Upgrade to Studio${billingCycle === 'yearly' ? '' : ''}`}
            onButtonClick={() => handleUpgrade('studio')}
            isLoading={isProcessing && processingPlan === 'studio'}
            colorClass="from-violet-600 to-purple-600"
            bgColorClass="from-violet-50 to-purple-50"
          />
        </div>

        {/* Why Upgrade Features */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Why Upgrade?</h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Unlock powerful features designed to accelerate your design workflow and enhance collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Rocket className="w-8 h-8" />,
                title: 'More Projects',
                description: 'Create up to 25 design projects with Pro, or unlimited with Studio.',
                gradient: 'from-violet-500 to-purple-600'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Advanced AI Features',
                description: 'Get more accurate product matching and enhanced design analysis powered by AI.',
                gradient: 'from-blue-500 to-indigo-600'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Priority Support',
                description: 'Get help when you need it with our dedicated support team and faster response times.',
                gradient: 'from-emerald-500 to-teal-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">
            Have questions? We've got answers to help you make the right choice.
          </p>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Can I cancel anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
              },
              {
                question: 'What happens to my projects if I downgrade?',
                answer: 'Your projects will remain accessible, but you\'ll be limited to 4 active projects on the Free plan or 25 on the Pro plan. You can archive older projects to stay within the limit.'
              },
              {
                question: 'Do you offer an ad-free experience?',
                answer: 'Yes! Upgrade to our Pro or Studio plan to enjoy an completely ad-free experience. Free plan users will see promotional content, but our paid subscribers get uninterrupted access to all design tools and features without any advertisements'
              },
              {
                question: 'What\'s the difference between monthly and yearly billing?',
                answer: 'Yearly billing offers a 20% discount compared to monthly billing. You\'ll be charged once per year instead of monthly.'
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                className="text-left bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-700 ease-out group overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ 
                  y: -3, 
                  scale: 1.005,
                  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                onMouseEnter={() => setHoveredFaq(index)}
                onMouseLeave={() => setHoveredFaq(null)}
              >
                {/* Question Section - Always Visible */}
                <div className="px-8 py-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full group-hover:bg-blue-500 transition-colors duration-500 ease-out"></div>
                      <h4 className="font-semibold text-slate-900 text-lg group-hover:text-violet-700 transition-colors duration-500 ease-out leading-relaxed">
                        {faq.question}
                      </h4>
                    </div>
                    <motion.div
                      className="text-slate-400 group-hover:text-violet-500 transition-colors duration-500 ease-out ml-4 flex-shrink-0"
                      animate={{ 
                        rotate: hoveredFaq === index ? 180 : 0
                      }}
                      transition={{ 
                        duration: 0.5, 
                        ease: [0.25, 0.46, 0.45, 0.94] 
                      }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </div>
                
                {/* Answer Section - Expandable */}
                <AnimatePresence>
                  {hoveredFaq === index && (
                    <motion.div
                      initial={{ 
                        height: 0,
                        opacity: 0
                      }}
                      animate={{ 
                        height: "auto",
                        opacity: 1
                      }}
                      exit={{ 
                        height: 0,
                        opacity: 0
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8">
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ 
                            y: 0, 
                            opacity: 1
                          }}
                          exit={{ 
                            y: -10, 
                            opacity: 0
                          }}
                          transition={{ 
                            duration: 0.4,
                            delay: 0.1,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        >
                          <div className="pl-6 border-l-2 border-slate-200 group-hover:border-violet-300 transition-colors duration-500 ease-out">
                            <p className="text-slate-600 leading-relaxed text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upgrade;