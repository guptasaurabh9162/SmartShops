
import { useState, useEffect } from 'react';
import { FilterOptions } from '@/types';
import { Slider } from '@/components/ui/slider';
import { Star, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSidebarProps {
  categories: string[];
  initialFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
  isMobile?: boolean;
}

export function FilterSidebar({ 
  categories, 
  initialFilters, 
  onFilterChange, 
  maxPrice, 
  isMobile = false
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange);
  const [isOpen, setIsOpen] = useState(false);
  
  // Update local filters when initial filters change
  useEffect(() => {
    setFilters(initialFilters);
    setPriceRange(initialFilters.priceRange);
  }, [initialFilters]);
  
  // Apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters, onFilterChange]);
  
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };
  
  const handleRatingChange = (rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  };
  
  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };
  
  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };
  
  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, maxPrice],
      rating: null,
      sortBy: 'popularity'
    });
    setPriceRange([0, maxPrice]);
  };
  
  const filterContent = (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium mb-3">Categories</h3>
          {isMobile && (
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange('')}
            className={cn(
              "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
              filters.category === ''
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary text-muted-foreground"
            )}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors capitalize",
                filters.category === category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-muted-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <div className="px-1 pb-6 pt-2">
          <Slider
            value={priceRange}
            min={0}
            max={maxPrice}
            step={1}
            onValueChange={handlePriceChange}
            className="my-4"
          />
          <div className="flex justify-between text-xs">
            <span>${priceRange[0].toFixed(0)}</span>
            <span>${priceRange[1].toFixed(0)}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Rating</h3>
        <div className="space-y-1">
          <button
            onClick={() => handleRatingChange(null)}
            className={cn(
              "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
              filters.rating === null
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary text-muted-foreground"
            )}
          >
            Any Rating
          </button>
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors flex items-center",
                filters.rating === rating
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < rating ? "fill-current" : "opacity-30"
                    )}
                  />
                ))}
              </div>
              <span className="ml-2">& Up</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Sort By</h3>
        <div className="space-y-1">
          {[
            { id: 'popularity', label: 'Popularity' },
            { id: 'price-low-high', label: 'Price: Low to High' },
            { id: 'price-high-low', label: 'Price: High to Low' },
            { id: 'rating', label: 'Customer Rating' },
          ].map(option => (
            <button
              key={option.id}
              onClick={() => handleSortChange(option.id as FilterOptions['sortBy'])}
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                filters.sortBy === option.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-muted-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={resetFilters}
        variant="outline" 
        className="w-full mt-2"
      >
        Reset Filters
      </Button>
    </div>
  );
  
  if (isMobile) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center mb-4"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            >
              <motion.div 
                className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-background p-6 shadow-xl overflow-y-auto z-50"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 30 }}
              >
                {filterContent}
              </motion.div>
              <div 
                className="fixed inset-0 cursor-pointer" 
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
  
  return (
    <div className="sticky top-24 w-full">
      {filterContent}
    </div>
  );
}
