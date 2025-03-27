
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { ProductGrid } from '@/components/product/product-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';

const MenuPage = () => {
  const { allProducts } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get category from URL or default to first category
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(
    categoryParam || categories[0].id
  );
  
  // Update URL when category changes
  useEffect(() => {
    setSearchParams({ category: activeCategory });
  }, [activeCategory, setSearchParams]);
  
  // Filter products by category and search term
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = product.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Group products by categories for the tab content
  const productsByCategory: Record<string, Product[]> = {};
  categories.forEach(category => {
    productsByCategory[category.id] = allProducts.filter(
      product => product.category === category.id
    );
  });
  
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
        <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
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
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No products found. Try a different search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MenuPage;
