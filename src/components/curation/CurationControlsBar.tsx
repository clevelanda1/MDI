import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, List, SlidersHorizontal, Eye, EyeOff, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { ViewSettings } from '../../types/curation';

interface CurationControlsBarProps {
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  hasActiveFilters: boolean;
  viewSettings: ViewSettings;
  isRefreshing: boolean;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  onRefreshProducts: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CurationControlsBar: React.FC<CurationControlsBarProps> = ({
  totalProducts,
  currentPage,
  totalPages,
  hasActiveFilters,
  viewSettings,
  isRefreshing,
  onClearFilters,
  onToggleFilters,
  onRefreshProducts,
  onViewModeChange
}) => {
  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-2xl border-b border-slate-200/30 relative z-10 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-white/30 to-slate-50/50 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          
          <div className="flex flex-wrap items-center gap-4">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm text-slate-700 font-semibold">
                {totalProducts} products curated
                {totalProducts > 24 && (
                  <span className="text-slate-500 ml-1">
                    • Page {currentPage} of {totalPages}
                  </span>
                )}
              </span>
            </motion.div>

            {hasActiveFilters && (
              <motion.button
                onClick={onClearFilters}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100/60 hover:bg-slate-200/60 border border-slate-200/50 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <span className="flex items-center gap-2">
                  <Filter size={14} className="group-hover:rotate-12 transition-transform duration-200" />
                  Clear filters
                </span>
              </motion.button>
            )}
          </div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={onToggleFilters}
              className="group relative flex items-center gap-3 px-5 py-3 border border-slate-300/50 rounded-2xl text-slate-600 hover:text-slate-800 hover:bg-slate-50/80 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl overflow-hidden"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              title={viewSettings.showFilters ? "Hide filters" : "Show filters"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100/20 via-transparent to-slate-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{ rotate: viewSettings.showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewSettings.showFilters ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.div>
                <span className="text-sm font-medium">
                  {viewSettings.showFilters ? 'Hide Filters' : 'Show Filters'}
                </span>
              </div>
            </motion.button>

            <motion.button
              onClick={onToggleFilters}
              className="lg:hidden group relative flex items-center gap-3 px-4 py-3 border border-slate-300/50 rounded-2xl text-slate-600 hover:text-slate-800 hover:bg-slate-50/80 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal size={18} className="group-hover:rotate-12 transition-transform duration-200" />
              <span className="text-sm font-medium">Filters</span>
            </motion.button>

            <div className="flex bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-1.5 shadow-lg">
              <motion.button
                onClick={() => onViewModeChange('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewSettings.viewMode === 'grid' 
                    ? 'bg-slate-100 text-slate-900 shadow-md' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Grid view"
              >
                <Grid3X3 size={18} />
              </motion.button>
              <motion.button
                onClick={() => onViewModeChange('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewSettings.viewMode === 'list' 
                    ? 'bg-slate-100 text-slate-900 shadow-md' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="List view"
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

export default CurationControlsBar;