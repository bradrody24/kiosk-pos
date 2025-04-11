
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { allProducts, addToCart, categories } = useApp();
  const [quantity, setQuantity] = useState(1);
  
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) {
    return (
      <PageLayout title="Product Not Found" showBack>
        <div className="flex flex-col items-center justify-center p-8 h-full">
          <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/menu')}>Return to Menu</Button>
        </div>
      </PageLayout>
    );
  }
  
  const category = categories.find(c => c.id === product.category_id);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };
  
  return (
    <PageLayout title="Product Details" showBack>
      <div className="pb-6">
        {/* Product Image */}
        <div className="relative h-72 flex items-center justify-center">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <PriceFormatter amount={product.price} className="text-xl font-bold text-primary" />
          </div>
          
          {category && (
            <Badge variant="default" className="mb-3">
              {category.name}
            </Badge>
          )}
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-medium">Quantity:</span>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-l-md rounded-r-none"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="h-9 w-12 flex items-center justify-center border-y text-center">
                {quantity}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-r-md rounded-l-none"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Total Price */}
          <div className="flex justify-between items-center py-4 border-t border-b mb-6">
            <span className="font-medium">Total:</span>
            <PriceFormatter amount={product.price * quantity} className="text-xl font-bold" />
          </div>
          
          {/* Add To Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className="w-full h-12 text-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
