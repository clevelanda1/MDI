import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart, Search } from 'lucide-react';
import { LikedProduct } from '../../lib/supabase';
import ProductCard from './ProductCard';
import EmptyStates from './EmptyStates';

interface ProductGridProps {
  isLoading: boolean;
  likedProducts: LikedProduct[];
  filteredProducts: LikedProduct[];
  hoveredProductId?: string | null;
  onDragStart: (e: React.DragEvent, product: LikedProduct) => void;
  onDoubleClick: (product: LikedProduct) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  isLoading,
  likedProducts,
  filteredProducts,
  hoveredProductId,
  onDragStart,
  onDoubleClick
}) => {
  // Get product color based on source
  const getProductHighlight = (product: LikedProduct, isHovered: boolean) => {
    if (!isHovered) return '';
    
    switch (product.source) {
      case 'amazon':
        return 'bg-orange-100 border-orange-300 shadow-lg shadow-orange-200/50';
      case 'etsy':
        return 'bg-emerald-100 border-emerald-300 shadow-lg shadow-emerald-200/50';
      default:
        return 'bg-blue-100 border-blue-300 shadow-lg shadow-blue-200/50';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.165, 0.84, 0.44, 1] 
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Enhanced Loading State
  if (isLoading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-48 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 rounded-2xl"></div>
        
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <motion.div
              className="w-12 h-12 border-3 border-slate-200 border-t-slate-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 w-12 h-12 border-3 border-transparent border-t-blue-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <div className="text-center">
            <motion.h3 
              className="font-semibold text-slate-900 mb-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading your collection...
            </motion.h3>
            <p className="text-sm text-slate-600">Gathering your liked products</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Enhanced Empty State
  if (filteredProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <EmptyStates 
          hasLikedProducts={likedProducts.length > 0}
          type="products"
        />
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Grid Header */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full"></div>
          <span className="text-sm font-medium text-slate-700">
            Your Collection
          </span>
        </div>
        
        {filteredProducts.length > 6 && (
          <motion.div
            className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            Scroll to see more
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Grid Container - No Scrollbar */}
      <motion.div 
        className="grid grid-cols-2 gap-4 max-h-[28rem] overflow-y-auto pt-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => {
            const isHovered = hoveredProductId === product.id;
            
            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                className={`relative transition-all duration-300 rounded-2xl ${
                  getProductHighlight(product, isHovered)
                }`}
              >
                <ProductCard
                  product={product}
                  index={index}
                  onDragStart={onDragStart}
                  onDoubleClick={onDoubleClick}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Scroll Gradient */}
      {filteredProducts.length > 6 && (
        <>
          <div className="absolute top-12 left-0 right-0 h-4 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent pointer-events-none z-10"></div>
        </>
      )}

      {/* Select More Favorites Button */}
      <motion.div 
        className="flex items-center justify-center mt-4 pt-3 border-t border-slate-200/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => window.location.href = '/studio'}
          className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full transition-all duration-200 border border-slate-200 hover:border-slate-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-3 h-3 text-red-500 fill-red-500 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">
            Select more favorites
          </span>
        </motion.button>
      </motion.div>
      
      {/* CSS to hide scrollbar for Webkit browsers */}
      <style jsx>{`
        .grid::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductGrid;