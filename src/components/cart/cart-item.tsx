
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Minus, Plus } from 'lucide-react';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { useApp } from '@/context/AppContext';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useApp();
  const { product, quantity } = item;
  
  return (
    <div className="flex py-4 border-b">
      <div className="h-20 w-20 overflow-hidden rounded-md">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="ml-3 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => removeFromCart(product.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <PriceFormatter amount={product.price * quantity} className="font-semibold" />
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-l-md rounded-r-none"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <div className="h-8 px-3 flex items-center justify-center border-y">
              {quantity}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-r-md rounded-l-none"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
