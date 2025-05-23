import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { ProductGrid } from '@/components/product/product-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Product } from '@/types';

const MenuPage = () => {
  const { allProducts, categories, loading, login, addToCart } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get category from URL or default to first category
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(
    (categories.length > 0 ? categories[0].id : '') || categoryParam
  );

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  /* const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); */

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log("Fetching user from MenuPage");
      if (!user) {
        navigate('/login');
      }
    };

    getUser();
  }, [navigate]);
  
  // Update active category when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);
  
  // Update URL when category changes
  useEffect(() => {
    if (activeCategory) {
      setSearchParams({ category: activeCategory });
    }
  }, [activeCategory, setSearchParams]);
  
  useEffect(() => {
    console.log('Products from MenuPage:', allProducts);
  }, [allProducts]);
  
  // Filter products by category and search term
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = product.category_id === activeCategory;
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  /* const handleAddToCart = (product: Product) => {
    if (product.is_notes_required) {
      // Show notes dialog
      setSelectedProduct(product);
      setNotesDialogOpen(true);
    } else {
      addToCart(product);
    }
  }; */

  /* const onAddToCart = async (name: string) => {
    addToCart({ ...product, name: name ? `${product.name} - ${name}` : product.name });
  }; */

  if (loading) {
    return (
      <PageLayout title="Menu" showBack={false}>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Menu" showBack={false}>
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search menu items..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue={activeCategory ? categories[0].id : null} onValueChange={setActiveCategory}>
          <TabsList className="w-full h-auto flex mb-6 overflow-x-auto justify-start">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex-shrink-0 py-1.5"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              {filteredProducts.length > 0 ? (
                <ProductGrid 
                  products={filteredProducts} 
                  /* onAddToCart={handleAddToCart}  */
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No products found. Try a different search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* <NotesDialog
        open={notesDialogOpen}
        onOpenChange={setNotesDialogOpen}
        product={selectedProduct}
        onAddToCart={addToCart}
      /> */}
    </PageLayout>
  );
};

export default MenuPage;