
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { CartItem } from '@/components/CartItem';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, ArrowLeft, ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
      
      toast.success('Order placed successfully!', {
        description: 'Thank you for your purchase.',
      });
      
      // Redirect to homepage after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/products" className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
            
            <h1 className="text-3xl font-bold mt-4 mb-2">Your Cart</h1>
          </div>
          
          <AnimatePresence mode="wait">
            {checkoutComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto text-center py-12"
              >
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-3">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. Your order is being processed.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/">
                    Return to Home
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ) : cart.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-secondary p-4">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button asChild>
                  <Link to="/products">
                    Browse Products
                    <ShoppingCart className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-3 gap-8"
              >
                <div className="md:col-span-2 glass-card p-6 rounded-xl">
                  <h2 className="text-lg font-semibold mb-4">Cart Items ({cart.length})</h2>
                  
                  <div className="space-y-1">
                    <AnimatePresence initial={false}>
                      {cart.map((item, index) => (
                        <CartItem key={item.id} item={item} index={index} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <div className="glass-card p-6 rounded-xl sticky top-24">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-border my-4"></div>
                      
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full mt-6"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Checkout"
                      )}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      By checking out, you agree to our Terms and Conditions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer - Simple version */}
      <footer className="bg-primary text-primary-foreground py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-primary-foreground/80">
            &copy; {new Date().getFullYear()} SmartShop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
