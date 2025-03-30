import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
/* import { products } from '@/data/mockData'; */

export default function HomePage() {
  const { addToCart, title } = useApp();
  
  // Get a random featured product
  /* const featuredProduct = React.useMemo(() => {
    const featuredProducts = products.filter(product => product.featured);
    if (featuredProducts.length === 0) return products[0]; // Fallback to first product if no featured ones
    const randomIndex = Math.floor(Math.random() * featuredProducts.length);
    return featuredProducts[randomIndex];
  }, []);

  if (!featuredProduct) {
    return (
      <PageLayout title="Home">
        <div className="p-4">
          <p className="text-center text-muted-foreground">Loading products...</p>
        </div>
      </PageLayout>
    );
  } */

  return (
    <PageLayout title="Home">
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">
            Discover our delicious menu
          </p>
        </div>

        {/* Promotional Banner */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
              alt="Burger and drinks"
              className="w-full h-80 object-cover" 
            />
            <CardContent className="p-6">
              <Link to="/menu" className="block">
                <Button className="w-full text-lg">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
