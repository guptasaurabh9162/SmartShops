
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  category: string;
  currentProductId: number;
  products: Product[];
  loading: boolean;
}

export function RelatedProducts({ 
  category, 
  currentProductId, 
  products, 
  loading 
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Filter products in the same category, excluding the current product
    const filtered = products
      .filter(p => p.category === category && p.id !== currentProductId)
      .slice(0, 10);
    
    setRelatedProducts(filtered);
  }, [category, currentProductId, products]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount = current.clientWidth * 0.8;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };
  
  if (loading) {
    return (
      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg skeleton-loader" />
          ))}
        </div>
      </div>
    );
  }
  
  if (relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-12 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Related Products</h2>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="rounded-full h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="rounded-full h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className={cn(
          "flex space-x-4 overflow-x-auto pb-4 no-scrollbar",
          "scroll-smooth snap-x snap-mandatory"
        )}
      >
        {relatedProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="min-w-[200px] sm:min-w-[240px] snap-start"
          >
            <ProductCard 
              product={product} 
              index={index} 
              compact={true} 
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
