import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, X, Sparkles, Star, ShoppingBag, DollarSign } from 'lucide-react';
import { CurationFilters } from '../../types/curation';
import { PRICE_RANGES } from '../../utils/constants';

interface FilterSidebarProps {
  filters: CurationFilters;
  detectedElements: string[];
  wishlistCount: number;
  isVisible: boolean;
  availableMarketplaces: { id: string; name: string; count: number }[];
  onSearchChange: (searchTerm: string) => void;
  onToggleElement: (element: string) => void;
  onTogglePriceRange: (minPrice: number) => void;
  onToggleFavoritesOnly: (showFavoritesOnly: boolean) => void;
  onToggleMarketplace: (marketplace: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  detectedElements,
  wishlistCount,
  isVisible,
  availableMarketplaces,
  onSearchChange,
  onToggleElement,
  onTogglePriceRange,
  onToggleFavoritesOnly,
  onToggleMarketplace
}) => {
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: [0.165, 0.84, 0.44, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }
    }
  };

  // Get marketplace-specific styling
  const getMarketplaceConfig = (id: string) => {
    switch (id) {
      case 'amazon':
        return {
          color: 'orange',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200',
          checkboxColor: 'text-orange-600'
        };
      case 'etsy':
        return {
          color: 'teal',
          bgColor: 'bg-teal-50',
          textColor: 'text-teal-700',
          borderColor: 'border-teal-200',
          checkboxColor: 'text-teal-600'
        };
      default:
        return {
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          checkboxColor: 'text-blue-600'
        };
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="lg:col-span-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 sticky top-24">
            
            {/* Enhanced Header */}
            <motion.div 
              className="flex items-center justify-between mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full shadow-sm"></div>
                <h2 className="font-bold text-2xl text-slate-900">Filters</h2>
              </div>
            </motion.div>

            {/* Enhanced Search Products */}
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-lg text-slate-900 mb-4">
                Search Products
              </h3>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search by product name..." 
                  value={filters.searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border border-slate-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm group-hover:border-slate-400/70 shadow-sm focus:shadow-md"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                {filters.searchTerm && (
                  <motion.button
                    onClick={() => onSearchChange('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Enhanced Favorites Filter */}
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-lg text-slate-900 mb-4">
                Favorites
              </h3>
              <motion.label 
                className="flex items-center group cursor-pointer p-4 rounded-2xl hover:bg-red-50/60 transition-all duration-300 border border-transparent hover:border-red-200/50"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filters.showFavoritesOnly}
                    onChange={(e) => onToggleFavoritesOnly(e.target.checked)}
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    filters.showFavoritesOnly 
                      ? 'bg-red-500 border-red-500' 
                      : 'border-slate-300 group-hover:border-red-300'
                  }`}>
                    {filters.showFavoritesOnly && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-full h-full"
                      >
                        <Heart size={14} className="text-white fill-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span className="text-slate-700 group-hover:text-slate-900 transition-colors font-medium">
                    Show Favorites Only
                  </span>
                  {wishlistCount > 0 && (
                    <motion.span 
                      className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-semibold border border-red-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </div>
              </motion.label>
            </motion.div>

            {/* Enhanced Marketplace Filter */}
            {availableMarketplaces.length > 0 && (
              <motion.div 
                className="mb-8"
                variants={itemVariants}
              >
                <h3 className="font-semibold text-lg text-slate-900 mb-6">
                  Marketplace
                </h3>
                <div className="space-y-3">
                  {availableMarketplaces.map((marketplace, index) => {
                    const config = getMarketplaceConfig(marketplace.id);
                    const isSelected = !filters.marketplaces || filters.marketplaces.includes(marketplace.id);
                    
                    return (
                      <motion.label 
                        key={marketplace.id} 
                        className={`flex items-center group cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
                          isSelected 
                            ? `${config.bgColor} ${config.borderColor} shadow-sm` 
                            : 'border-transparent hover:bg-slate-50/60 hover:border-slate-200/50'
                        }`}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => onToggleMarketplace(marketplace.id)}
                          />
                          <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                            isSelected 
                              ? `bg-${config.color}-500 border-${config.color}-500` 
                              : 'border-slate-300 group-hover:border-slate-400'
                          }`}>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center w-full h-full"
                              >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center justify-between flex-1">
                          <span className={`font-medium transition-colors ${
                            isSelected ? config.textColor : 'text-slate-700 group-hover:text-slate-900'
                          }`}>
                            {marketplace.name}
                          </span>
                          <motion.span 
                            className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                              isSelected 
                                ? `${config.bgColor} ${config.textColor} ${config.borderColor}` 
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {marketplace.count}
                          </motion.span>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Enhanced Detected Elements */}
            {detectedElements.length > 0 && (
              <motion.div 
                className="mb-8"
                variants={itemVariants}
              >
                <h3 className="font-semibold text-lg text-slate-900 mb-6">
                  Detected Items
                </h3>
                <div className="space-y-3">
                  {detectedElements.map((element, index) => {
                    const isSelected = filters.selectedElements.includes(element);
                    
                    return (
                      <motion.label 
                        key={element} 
                        className={`flex items-center group cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                            : 'border-transparent hover:bg-slate-50/60 hover:border-slate-200/50'
                        }`}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => onToggleElement(element)}
                          />
                          <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : 'border-slate-300 group-hover:border-emerald-300'
                          }`}>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center w-full h-full"
                              >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <span className={`ml-4 font-medium transition-colors ${
                          isSelected ? 'text-emerald-700' : 'text-slate-700 group-hover:text-slate-900'
                        }`}>
                          {element}
                        </span>
                      </motion.label>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Enhanced Price Ranges */}
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-lg text-slate-900 mb-6">
                Price Range
              </h3>
              <div className="space-y-3">
                {PRICE_RANGES.map((range, index) => {
                  const isSelected = filters.selectedPriceRange.includes(range.min);
                  
                  return (
                    <motion.label 
                      key={range.min} 
                      className={`flex items-center group cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
                        isSelected 
                          ? 'bg-orange-50 border-orange-200 shadow-sm' 
                          : 'border-transparent hover:bg-slate-50/60 hover:border-slate-200/50'
                      }`}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => onTogglePriceRange(range.min)}
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-orange-500 border-orange-500' 
                            : 'border-slate-300 group-hover:border-orange-300'
                        }`}>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-center w-full h-full"
                            >
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <span className={`ml-4 font-medium transition-colors ${
                        isSelected ? 'text-orange-700' : 'text-slate-700 group-hover:text-slate-900'
                      }`}>
                        {range.label}
                      </span>
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;