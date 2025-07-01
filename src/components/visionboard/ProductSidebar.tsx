import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, X, Sparkles, Layers, MousePointer, Info } from 'lucide-react';
import { ProductFilterState } from '../../types/visionboard';
import { LikedProduct, Project } from '../../lib/supabase';
import ProductGrid from './ProductGrid';

interface ProductSidebarProps {
  isVisible: boolean;
  isLoading: boolean;
  likedProducts: LikedProduct[];
  filteredProducts: LikedProduct[];
  filters: ProductFilterState;
  projectOptions: { id: string; name: string }[];
  hoveredProductId?: string | null;
  onSearchChange: (query: string) => void;
  onProjectChange: (projectId: string) => void;
  onDragStart: (e: React.DragEvent, product: LikedProduct) => void;
  onDoubleClick: (product: LikedProduct) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  isVisible,
  isLoading,
  likedProducts,
  filteredProducts,
  filters,
  projectOptions,
  hoveredProductId,
  onSearchChange,
  onProjectChange,
  onDragStart,
  onDoubleClick
}) => {
  // Get product color based on source
  const getProductColor = (source: string) => {
    switch (source) {
      case 'amazon':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          shadow: 'shadow-orange-100'
        };
      case 'etsy':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          shadow: 'shadow-emerald-100'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          shadow: 'shadow-blue-100'
        };
    }
  };

  // Find the hovered product to get its color
  const hoveredProduct = hoveredProductId 
    ? filteredProducts.find(p => p.id === hoveredProductId)
    : null;
  
  const sidebarStyle = hoveredProduct 
    ? getProductColor(hoveredProduct.source)
    : null;

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
          <div className={`bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl p-6 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 sticky top-24 ${
            sidebarStyle ? `${sidebarStyle.bg} ${sidebarStyle.border} ${sidebarStyle.shadow}` : ''
          }`}>
            
            {/* Enhanced Header */}
            <motion.div 
              className="flex items-center justify-between mb-6"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h2 className="font-semibold text-slate-900 text-base">Liked Products</h2>
                {likedProducts.length > 0 && (
                  <motion.span 
                    className="px-2 py-0.5 bg-red-100 text-red-700 rounded-xl text-xs font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {likedProducts.length}
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Enhanced Instructions with Hover Effect */}
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-6 border border-blue-200/50 group cursor-pointer overflow-hidden"
              variants={itemVariants}
            >
              {/* Header - Always visible */}
              <div className="flex items-center justify-between p-4">
                <h3 className="font-semibold text-blue-900 text-sm">Quick Actions</h3>
                <Info className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </div>
              
              {/* Details - Show on hover */}
              <div className="px-4 pb-0 max-h-0 group-hover:max-h-24 group-hover:pb-4 transition-all duration-300 overflow-hidden">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MousePointer className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-xs text-blue-700">
                      <strong>Drag & Drop:</strong> Move items to board
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Layers className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-xs text-blue-700">
                      <strong>Double-Click:</strong> Add to center
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Search */}
            <motion.div 
              className="relative mb-4"
              variants={itemVariants}
            >
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="Search your liked products..."
                  value={filters.searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-slate-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm group-hover:border-slate-400/70 shadow-sm focus:shadow-md"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
                {filters.searchQuery && (
                  <motion.button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Enhanced Project Filter */}
            <motion.div 
              className="relative mb-6"
              variants={itemVariants}
            >
              <div className="relative group">
                <select 
                  value={filters.selectedProject}
                  onChange={(e) => onProjectChange(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-slate-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm appearance-none cursor-pointer group-hover:border-slate-400/70 shadow-sm focus:shadow-md"
                >
                  {projectOptions.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Products Count and Status */}
            <motion.div 
              className="flex items-center justify-between mb-4"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-700 font-medium">
                  {filteredProducts.length} products
                  {filters.searchQuery && filteredProducts.length !== likedProducts.length && (
                    <span className="text-slate-500 ml-1">
                      of {likedProducts.length}
                    </span>
                  )}
                </span>
              </div>
              
              {/* Clear Search Button */}
              {filters.searchQuery && (
                <motion.button
                  onClick={() => onSearchChange('')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100/60 hover:bg-slate-200/60 border border-slate-200/50 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  Clear search
                </motion.button>
              )}
            </motion.div>

            {/* Enhanced Product Grid */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              {/* Loading State Enhancement */}
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      className="w-8 h-8 border-2 border-slate-300 border-t-slate-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-sm text-slate-600 font-medium">Loading products...</span>
                  </div>
                </motion.div>
              )}

              {/* Empty State Enhancement */}
              {!isLoading && filteredProducts.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {filters.searchQuery ? 'No matches found' : 'No liked products yet'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">
                    {filters.searchQuery 
                      ? 'Try adjusting your search terms or clearing the filter.'
                      : 'Start liking products from the curation page to build your collection.'
                    }
                  </p>
                </motion.div>
              )}

              {/* Product Grid */}
              {!isLoading && filteredProducts.length > 0 && (
                <ProductGrid
                  isLoading={isLoading}
                  likedProducts={likedProducts}
                  filteredProducts={filteredProducts}
                  hoveredProductId={hoveredProductId}
                  onDragStart={onDragStart}
                  onDoubleClick={onDoubleClick}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductSidebar;