
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Star, ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index: number;
  compact?: boolean;
}

export function ProductCard({ product, index, compact = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className={cn(
        "group perspective",
        compact ? "h-full" : "h-full"
      )}
    >
      <Link 
        to={`/product/${product.id}`}
        className={cn(
          "flex flex-col h-full overflow-hidden rounded-lg product-card-shadow bg-white dark:bg-black/20 border border-border/40 transition-all duration-300",
          "hover:border-border/80 preserve-3d",
          compact ? "p-3" : "p-4"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className={cn(
          "relative overflow-hidden rounded-md bg-secondary/30 flex items-center justify-center mb-4 transition-all duration-300",
          compact ? "h-40" : "h-56"
        )}>
          {/* Skeleton Loader */}
          {!isImageLoaded && (
            <div className="absolute inset-0 skeleton-loader" />
          )}
          
          <motion.img
            src={product.image}
            alt={product.title}
            onLoad={() => setIsImageLoaded(true)}
            className={cn(
              "object-contain h-full w-full p-4 transition-all duration-500",
              !isImageLoaded && "opacity-0",
              isHovered && "scale-110"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Quick add to cart button */}
          <motion.button
            onClick={handleAddToCart}
            className={cn(
              "absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2",
              "opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0",
              "transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
            aria-label="Add to cart"
            initial={{ opacity: 0, y: 20 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          {/* Category */}
          <div className="text-xs font-medium text-muted-foreground mb-1 capitalize">
            {product.category}
          </div>
          
          {/* Title */}
          <h3 className={cn(
            "font-medium line-clamp-2 flex-1 mb-2",
            compact ? "text-sm" : "text-base"
          )}>
            {product.title}
          </h3>
          
          {/* Bottom Row: Price and Rating */}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold">
              ${product.price.toFixed(2)}
            </span>
            
            <div className="flex items-center text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs ml-1 text-muted-foreground">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
