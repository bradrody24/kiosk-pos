import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { NotesDialog } from '@/components/product/notes-dialog';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useApp();
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);

  const handleNotesDialog = (product: Product) => {
    if (product.is_notes_required) {
      // Show notes dialog
      setNotesDialogOpen(true);
    } else {
      addToCart(product);
    }
  };

  const handleAddToCart = async (payload: Product) => {
    addToCart(payload);
  };
  
  return (
    <Card className="overflow-hidden h-full">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-30 overflow-hidden">
          <div className="flex items-center justify-center h-24"> {/* Adjusted height to be smaller */}
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="h-auto w-auto object-center object-cover transition-transform hover:scale-105"
            />
          </div>
          {/* {product.featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
              Featured
            </div>
          )} */}
        </div>
      </Link>
      
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`} className="hover:underline">
            <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
          </Link>
          <PriceFormatter amount={product.price} className="font-bold text-primary" />
        </div>
        
        <p className="text-sm text-muted-foreground truncate mb-3">{product.description}</p>
        
        <Button 
          onClick={() => {handleNotesDialog(product)}} 
          variant="default" 
          size="sm" 
          className="w-full text-sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add to Cart
        </Button>
      </CardContent>
    
      <NotesDialog
        open={notesDialogOpen}
        onOpenChange={setNotesDialogOpen}
        product={product}
        onAddToCart={handleAddToCart}
      />
    </Card>
  );
}
