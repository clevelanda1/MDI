import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { UnifiedProduct } from '../../types/curation';

interface ProductCardProps {
  product: UnifiedProduct;
  isLiked: boolean;
  viewMode: 'grid' | 'list';
  index: number;
  onToggleWishlist: (product: UnifiedProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isLiked,
  viewMode,
  index,
  onToggleWishlist
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
        <div className={`${viewMode === 'list' ? 'h-40' : 'h-64'} bg-gray-100`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover p-4"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x300/f1f5f9/64748b?text=Product';
            }}
          />
        </div>

        {/* Heart */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm"
          onClick={() => onToggleWishlist(product)}
        >
          <Heart
            size={16}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
        
        {/* Source */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
          product.source === 'amazon' 
            ? 'bg-orange-100 text-orange-700' 
            : 'bg-teal-100 text-teal-700'
        }`}>
          {product.source}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i}
                size={12} 
                className={i < Math.round(product.rating) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)} ({product.reviewsCount})
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;