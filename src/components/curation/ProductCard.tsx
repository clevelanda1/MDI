import React from 'react';
import { Heart, Star } from 'lucide-react';

interface UnifiedProduct {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  source: string;
  url: string;
}

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
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
        <div className={`${viewMode === 'list' ? 'h-40' : 'h-64'} bg-gray-50 overflow-hidden`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x300/f1f5f9/64748b?text=Product';
            }}
          />
        </div>

        {/* Heart */}
        <button
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
          onClick={() => onToggleWishlist(product)}
        >
          <Heart
            size={18}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}
          />
        </button>
                
        {/* Source */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
          product.source === 'amazon' 
            ? 'bg-orange-500 text-white' 
            : 'bg-teal-500 text-white'
        }`}>
          {product.source}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1">
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight">
          {product.title}
        </h3>
                
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i}
                size={14}
                className={i < Math.round(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {product.rating.toFixed(1)} ({product.reviewsCount})
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
                    
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-blue-100 text-blue-700 rounded-3xl text-sm font-semibold hover:bg-blue-200 transition-colors duration-200"
          >
            View Product
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;