
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ProductDetails } from '@/components/ProductDetails';
import { RelatedProducts } from '@/components/RelatedProducts';
import { Product } from '@/types';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Fetch specific product
        const productResponse = await fetch(`https://fakestoreapi.com/products/${id}`);
        
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const productData = await productResponse.json();
        setProduct(productData);
        
        // Fetch all products for related items
        const allProductsResponse = await fetch('https://fakestoreapi.com/products');
        
        if (!allProductsResponse.ok) {
          throw new Error('Failed to fetch related products');
        }
        
        const allProductsData = await allProductsResponse.json();
        setAllProducts(allProductsData);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndRelated();
    
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Product Details */}
          <section className="mb-16">
            <ProductDetails product={product as Product} loading={loading} />
          </section>
          
          {/* Related Products */}
          {product && (
            <RelatedProducts
              category={product.category}
              currentProductId={product.id}
              products={allProducts}
              loading={loading}
            />
          )}
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

export default ProductDetail;
