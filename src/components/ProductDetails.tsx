
import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Minus, Plus, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  loading: boolean;
}

export function ProductDetails({ product, loading }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product, quantity);

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square rounded-lg skeleton-loader" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded skeleton-loader" />
          <div className="h-4 w-1/4 rounded skeleton-loader" />
          <div className="h-4 w-full rounded skeleton-loader" />
          <div className="h-4 w-full rounded skeleton-loader" />
          <div className="h-4 w-3/4 rounded skeleton-loader" />
          <div className="h-10 w-full rounded skeleton-loader mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square bg-secondary/30 rounded-lg flex items-center justify-center overflow-hidden glass-card"
        >
          {!isImageLoaded && (
            <div className="absolute inset-0 skeleton-loader" />
          )}
          <img
            src={product.image}
            alt={product.title}
            onLoad={() => setIsImageLoaded(true)}
            className={cn(
              "object-contain max-h-full max-w-full p-12 transition-opacity duration-500",
              !isImageLoaded && "opacity-0"
            )}
          />
        </motion.div>

        {/* Product Images Thumbnails - Simulated */}
        <div className="flex space-x-2 justify-center">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className={cn(
                "w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                i === 0 ? "border-primary" : "border-border hover:border-primary/50"
              )}
            >
              <img
                src={product.image}
                alt={`Product view ${i + 1}`}
                className="w-full h-full object-contain p-2"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Category */}
        <div className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium capitalize">
          {product.category}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold">{product.title}</h1>

        {/* Rating */}
        <div className="flex items-center">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating.rate) ? "fill-current" : "opacity-30"
                )}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            {product.rating.rate} ({product.rating.count} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        {/* Quantity Selector and Add to Cart */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none border-r border-border"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none border-l border-border"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button
            className="w-full relative overflow-hidden group py-6"
            size="lg"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <AnimatePresence mode="wait">
              {isAddingToCart ? (
                <motion.span
                  key="adding"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  Added to Cart!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="border-t border-border pt-6 mt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Availability:</span>
              <span className="ml-2 font-medium text-green-600">In Stock</span>
            </div>
            <div>
              <span className="text-muted-foreground">Shipping:</span>
              <span className="ml-2 font-medium">Free</span>
            </div>
            <div>
              <span className="text-muted-foreground">SKU:</span>
              <span className="ml-2 font-medium">SKU-{product.id.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
