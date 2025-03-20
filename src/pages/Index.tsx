
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Truck, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('https://fakestoreapi.com/products?limit=8'),
          fetch('https://fakestoreapi.com/products/categories')
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
        
        // Set a featured product image
        if (productsData.length > 0) {
          const featuredIndex = Math.floor(Math.random() * productsData.length);
          setHeroImage(productsData[featuredIndex].image);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-16 relative bg-gradient-to-b from-secondary/50 to-background/10 pt-12 pb-20 overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Premium Shopping Experience
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Discover Products with Exceptional Quality
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                Explore our curated collection of high-quality products designed to elevate your lifestyle. Shop with confidence on SmartShop.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="btn"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  to="/products" 
                  className="btn-outline btn"
                >
                  Explore Categories
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative perspective"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-2xl glass-card overflow-hidden flex items-center justify-center p-8 preserve-3d transform rotate-y-[-8deg] shadow-2xl hover:rotate-y-0 transition-all duration-500">
                  {heroImage && (
                    <img 
                      src={heroImage} 
                      alt="Featured product" 
                      className="object-contain max-h-full max-w-full animate-float"
                    />
                  )}
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full filter blur-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
      </motion.section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <ShoppingBag className="h-8 w-8" />, 
                title: "Premium Selection", 
                description: "Curated collection of high-quality products from trusted brands." 
              },
              { 
                icon: <Truck className="h-8 w-8" />, 
                title: "Fast Delivery", 
                description: "Get your orders delivered quickly with our efficient shipping." 
              },
              { 
                icon: <ShieldCheck className="h-8 w-8" />, 
                title: "Secure Shopping", 
                description: "Shop with confidence with our secure payment system." 
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl glass-card"
              >
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Discover our top picks just for you</p>
            </div>
            <Link 
              to="/products" 
              className="text-primary flex items-center hover:underline"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 rounded-lg skeleton-loader" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse our extensive collection of products organized by categories
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 rounded-lg skeleton-loader" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative h-48 overflow-hidden rounded-lg glass-card group"
                >
                  <Link 
                    to={`/products?category=${category}`}
                    className="block h-full w-full p-6 flex flex-col justify-between"
                  >
                    <div className="z-10 relative">
                      <h3 className="text-lg font-semibold capitalize mb-1">{category}</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore our {category} collection
                      </p>
                    </div>
                    <div className="flex justify-between items-center z-10 relative">
                      <span className="text-sm font-medium">Shop Now</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-primary/5 to-transparent transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hear from our satisfied customers about their shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            {
              name: "Rajesh Sharma",
              rating: 5,
              text: "Outstanding product quality and timely delivery. It exceeded my expectations. I will definitely shop here again!"
            },
            {
              name: "Priya Iyer",
              rating: 5,
              text: "The user experience on this platform is excellent. Easy navigation, quick product search, and a smooth checkout process."
            },
            {
              name: "Amit Gupta",
              rating: 4,
              text: "Great variety of products at competitive prices. Customer support was prompt and helpful when I had inquiries."
            }
            
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl glass-card"
              >
                <div className="flex text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-4 w-4 mr-1",
                        i < testimonial.rating ? "fill-current" : "opacity-30"
                      )} 
                    />
                  ))}
                </div>
                <p className="italic mb-4 text-muted-foreground">"{testimonial.text}"</p>
                <p className="font-medium">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SmartShop</h3>
              <p className="text-primary-foreground/80 text-sm">
                Your destination for premium products with exceptional quality and service.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase">Shop</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                {categories.map(category => (
                  <li key={category}>
                    <Link 
                      to={`/products?category=${category}`}
                      className="hover:text-primary-foreground transition-colors capitalize"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase">Information</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-primary-foreground transition-colors">FAQs</Link></li>
                <li><Link to="/" className="hover:text-primary-foreground transition-colors">Shipping & Returns</Link></li>
                <li><Link to="/" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase">Contact</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>info@smartshop.com</li>
                <li>7231951970</li>
                <li>Whitefield,Karnatak</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} SmartShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
