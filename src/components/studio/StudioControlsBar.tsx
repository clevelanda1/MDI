import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, List, Layout, BarChart, Crown, Sparkles, Zap } from 'lucide-react';
import { ProjectFilters } from '../../types/studio';
import { ApiUsage, GlobalApiLimits } from '../../services/apiUsageService';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Link } from 'react-router-dom';

interface StudioControlsBarProps {
  projectCount: number;
  searchQuery: string;
  filters: ProjectFilters;
  apiUsage?: ApiUsage | null;
  globalLimits?: GlobalApiLimits;
  onClearSearch: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onShowApiUsage?: () => void;
}

const StudioControlsBar: React.FC<StudioControlsBarProps> = ({
  projectCount,
  searchQuery,
  filters,
  apiUsage,
  globalLimits,
  onClearSearch,
  onViewModeChange,
  onShowApiUsage
}) => {
  const { subscription } = useSubscription();
  
  // Calculate API usage percentages
  const getApiUsagePercent = (current: number, limit: number) => {
    if (limit <= 0) return 0; // Avoid division by zero
    return Math.min(100, Math.round((current / limit) * 100));
  };

  const amazonUsagePercent = apiUsage && globalLimits?.amazon.monthly_limit 
    ? getApiUsagePercent(apiUsage.amazon_total_count, globalLimits.amazon.monthly_limit)
    : 0;
    
  const etsyUsagePercent = apiUsage && globalLimits?.etsy.monthly_limit
    ? getApiUsagePercent(apiUsage.etsy_total_count, globalLimits.etsy.monthly_limit)
    : 0;

  // Determine color based on usage percentage
  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'text-red-400';
    if (percent >= 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getUsageColorBg = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // Get Etsy limit based on subscription tier
  const getEtsyLimit = () => {
    if (subscription.tier === 'free') return 25;
    if (subscription.tier === 'pro') return 125;
    return 750; // studio tier
  };

  // Enhanced tier configuration
  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'studio':
        return {
          icon: Crown,
          bgColor: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
          borderColor: 'border-blue-500/20',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500'
        };
      case 'pro':
        return {
          icon: Zap,
          bgColor: 'bg-gradient-to-r from-violet-500/10 to-purple-500/10',
          borderColor: 'border-violet-500/20',
          textColor: 'text-violet-700',
          iconColor: 'text-violet-500'
        };
      default:
        return {
          icon: Sparkles,
          bgColor: 'bg-gradient-to-r from-slate-500/10 to-gray-500/10',
          borderColor: 'border-slate-500/20',
          textColor: 'text-slate-700',
          iconColor: 'text-slate-500'
        };
    }
  };

  const tierConfig = getTierConfig(subscription.tier);

  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-2xl border-b border-slate-200/30 relative z-10 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-white/30 to-slate-50/50 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          
          {/* Left Section - Enhanced */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Project Count with animated indicator */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm text-slate-700 font-semibold">
                {projectCount} projects {searchQuery ? 'found' : 'created'}
              </span>
            </motion.div>

            {/* Enhanced Clear Search Button */}
            {searchQuery && (
              <motion.button
                onClick={onClearSearch}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100/60 hover:bg-slate-200/60 border border-slate-200/50 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Clear search
              </motion.button>
            )}
            
            {/* Enhanced Subscription Tier Badge */}
            <motion.div
              className={`flex items-center gap-2 px-4 py-2.5 ${tierConfig.bgColor} ${tierConfig.borderColor} border rounded-full backdrop-blur-sm shadow-md`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -1 }}
            >
              {/*<tierConfig.icon size={16} className={tierConfig.iconColor} />*/}
              <span className={`text-xs font-bold ${tierConfig.textColor} uppercase tracking-wide`}>
                {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
              </span>
            </motion.div>
            
            {/* Enhanced API Usage Indicators */}
            {apiUsage && globalLimits && (
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {globalLimits.amazon.monthly_limit > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/60 border border-slate-200/40 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${getUsageColor(amazonUsagePercent)}`}>
                        Amazon
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        {apiUsage.amazon_total_count}/{globalLimits.amazon.monthly_limit}
                      </span>
                    </div>
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${getUsageColorBg(amazonUsagePercent)} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${amazonUsagePercent}%` }}
                        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
                
                {globalLimits.etsy.monthly_limit > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/60 border border-slate-200/40 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${getUsageColor(etsyUsagePercent)}`}>
                        Etsy
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        {apiUsage.etsy_total_count}/{getEtsyLimit()}
                      </span>
                    </div>
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${getUsageColorBg(getApiUsagePercent(apiUsage.etsy_total_count, getEtsyLimit()))} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${getApiUsagePercent(apiUsage.etsy_total_count, getEtsyLimit())}%` }}
                        transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
                
                {onShowApiUsage && (
                  <motion.button
                    onClick={onShowApiUsage}
                    className="p-2.5 text-slate-500 hover:text-slate-700 bg-white/60 hover:bg-white/80 border border-slate-200/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5, y: -1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View API usage details"
                  >
                    <BarChart size={16} />
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Right Section - Enhanced */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Enhanced Upgrade Button */}
            {subscription.tier === 'free' && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/upgrade"
                  className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-transparent to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <div className="relative flex items-center gap-2">
                    <Crown size={16} />
                    <span>Upgrade Access</span>
                  </div>
                </Link>
              </motion.div>
            )}
            
            {/* Enhanced Vision Board Button */}
            <motion.button
              onClick={() => window.location.href = '/visionboard'}
              className="group relative flex items-center gap-3 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Subtle hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 via-transparent to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center gap-3">
                <Layout size={16} />
                <span>Vision Board</span>
                
                {/* Enhanced BETA Badge */}
                <div className="relative">
                  <span className="relative z-10 px-2.5 py-1 text-xs font-black bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-full shadow-md">
                    BETA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-blue-400 rounded-full blur-sm opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                </div>
              </div>
            </motion.button>
            
            {/* Enhanced View Mode Toggle */}
            <div className="flex bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-1.5 shadow-lg">
              <motion.button 
                onClick={() => onViewModeChange('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  filters.viewMode === 'grid' 
                    ? 'bg-slate-100 text-slate-900 shadow-md' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid3X3 size={18} />
              </motion.button>
              <motion.button 
                onClick={() => onViewModeChange('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  filters.viewMode === 'list' 
                    ? 'bg-slate-100 text-slate-900 shadow-md' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudioControlsBar;
