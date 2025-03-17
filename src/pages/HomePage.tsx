
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { categories } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const HomePage = () => {
  const { allProducts } = useApp();
  
  // Get featured products
  const featuredProducts = allProducts.filter(product => product.featured);
  
  return (
    <PageLayout>
      <div className="pb-6">
        {/* Hero Section */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2070&auto=format&fit=crop" 
            alt="Burger Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-white text-3xl font-bold mb-2">Burger Chain</h1>
            <p className="text-white/90 text-sm">Order now for store pickup</p>
          </div>
        </div>
        
        {/* Categories Section */}
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Categories</h2>
            <Link to="/menu" className="text-primary text-sm flex items-center">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                className="flex-shrink-0 py-2 px-4 bg-muted rounded-full hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Featured Products Section */}
        <div className="px-4 py-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Featured Items</h2>
            <Link to="/menu" className="text-primary text-sm flex items-center">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} />
        </div>
        
        {/* Admin Access Button */}
        <div className="p-4 mt-6">
          <Link to="/admin">
            <Button variant="outline" className="w-full">
              Admin Access
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
