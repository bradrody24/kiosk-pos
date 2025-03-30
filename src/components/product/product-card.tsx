
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();
  
  return (
    <Card className="overflow-hidden h-full">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-40 overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          {product.featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
              Featured
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`} className="hover:underline">
            <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
          </Link>
          <PriceFormatter amount={product.price} className="font-bold text-primary" />
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        
        <Button 
          onClick={() => addToCart(product)} 
          variant="default" 
          size="sm" 
          className="w-full text-sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
