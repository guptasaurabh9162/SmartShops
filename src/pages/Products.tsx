
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Product, FilterOptions } from '@/types';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const Products = () => {
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000);
  
  const initialCategory = searchParams.get('category') || '';
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: initialCategory,
    priceRange: [0, maxPrice],
    rating: null,
    sortBy: 'popularity'
  });

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('https://fakestoreapi.com/products'),
          fetch('https://fakestoreapi.com/products/categories')
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Find the maximum price
        const highestPrice = Math.ceil(
          Math.max(...productsData.map((p: Product) => p.price))
        );
        setMaxPrice(highestPrice);
        setFilters(prev => ({
          ...prev,
          priceRange: [0, highestPrice]
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    
    // Apply price range filter
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    
    // Apply rating filter
    if (filters.rating !== null) {
      result = result.filter(p => p.rating.rate >= filters.rating!);
    }
    
    // Apply search query if exists
    if (initialSearchQuery) {
      const query = initialSearchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.rating.count - a.rating.count);
        break;
    }
    
    setFilteredProducts(result);
  }, [filters, products, initialSearchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Products</h1>
            <p className="text-muted-foreground">
              {initialSearchQuery ? (
                <>Search results for: <span className="font-medium">{initialSearchQuery}</span></>
              ) : initialCategory ? (
                <>Browsing <span className="font-medium capitalize">{initialCategory}</span> products</>
              ) : (
                <>Browse our collection of premium products</>
              )}
            </p>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile filters */}
            {isMobile && (
              <FilterSidebar
                categories={categories}
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                maxPrice={maxPrice}
                isMobile={true}
              />
            )}
            
            {/* Desktop sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <FilterSidebar
                categories={categories}
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                maxPrice={maxPrice}
              />
            </div>
            
            {/* Products */}
            <div className="flex-1">
              <ProductGrid products={filteredProducts} loading={loading} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer - Simple version */}
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-primary-foreground/80">
            &copy; {new Date().getFullYear()} SmartShop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
