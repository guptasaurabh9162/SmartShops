
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '@/types';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  index: number;
}

export function CartItem({ item, index }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className="flex items-start space-x-4 py-4 border-b border-border last:border-0"
    >
      {/* Product Image */}
      <div className="relative h-24 w-24 rounded-md bg-secondary/30 flex-shrink-0 overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 skeleton-loader" />
        )}
        <Link to={`/product/${item.id}`}>
          <img 
            src={item.image} 
            alt={item.title} 
            onLoad={() => setIsImageLoaded(true)}
            className={cn(
              "h-full w-full object-contain p-2",
              !isImageLoaded && "opacity-0"
            )}
          />
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.id}`} className="hover:underline">
          <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 capitalize">{item.category}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold">${item.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">
            Subtotal: ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Quantity Adjuster */}
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="p-1 hover:bg-secondary transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="p-1 hover:bg-secondary transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        
        <button
          onClick={handleRemove}
          className="text-muted-foreground hover:text-destructive transition-colors text-xs flex items-center"
          aria-label="Remove item"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Remove
        </button>
      </div>
    </motion.div>
  );
}
