import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  title: string;
  categories: Category[];
  defaultValues?: ProductFormData;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string;
  is_notes_required: boolean;
}

export function ProductDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  title,
  categories,
  defaultValues 
}: ProductDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_notes_required: false,
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      setFormData({
        name: defaultValues.name,
        description: defaultValues.description,
        price: defaultValues.price.toString(),
        category_id: defaultValues.category_id,
        image_url: defaultValues.image_url || '',
        is_notes_required: defaultValues.is_notes_required || false,
      });
      setImagePreview(defaultValues.image_url || '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_notes_required: false,
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [defaultValues, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        setUploadingImage(true);
        finalImageUrl = await uploadImage(imageFile);
        setUploadingImage(false);
      }

      await onSubmit({
        ...formData,
        image_url: finalImageUrl,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="product-form-description" className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p id="product-form-description" className="sr-only">
          {title === 'New Product' ? 'Create a new product' : 'Edit existing product'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Product name"
                className="h-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                className="h-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                required
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 py-4"> {/* Added padding top and bottom */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notes-required"
                  checked={formData.is_notes_required}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_notes_required: checked as boolean }))
                  }
                />
                <Label htmlFor="notes-required">Require notes for this product</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex flex-col items-center gap-4 border border-light-gray">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, image_url: '' }));
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-primary"
                    >
                      <ImagePlus className="w-8 h-8 text-muted-foreground" />
                      <span className="mt-2 text-sm text-muted-foreground">
                        Click to upload image
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || uploadingImage}
            >
              {loading || uploadingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadingImage ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 