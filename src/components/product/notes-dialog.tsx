import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useState } from 'react';

interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onAddToCart: (product: Product, notes?: string) => void;
}

export function NotesDialog({ open, onOpenChange, product, onAddToCart }: NotesDialogProps) {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (product) {
      onAddToCart({ ...product, name: notes ? `${product.name} - ${notes}` : product.name });
      setNotes('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="notes-description">
        <DialogHeader>
          <DialogTitle>Add Notes for {product?.name}</DialogTitle>
        </DialogHeader>
        <p id="notes-description" className="sr-only">
          Enter any special notes or instructions for this item
        </p>
        <Input
          placeholder="Enter notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button onClick={handleSubmit}>Add to Cart</Button>
      </DialogContent>
    </Dialog>
  );
} 