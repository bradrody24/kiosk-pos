import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { products } from '@/data/mockData';

export default function HomePage() {
  const { addToCart, title } = useApp();
  
  // Get a random featured product
  const featuredProduct = React.useMemo(() => {
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
  }

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

        {/* Featured Product */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Featured Product</h2>
          <Card className="overflow-hidden">
            <img 
              src={featuredProduct.image} 
              alt={featuredProduct.name}
              className="w-full h-64 object-cover" // Increased height
            />
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{featuredProduct.name}</h3>
                  <p className="text-muted-foreground text-sm">{featuredProduct.description}</p>
                </div>
                <PriceFormatter 
                  amount={featuredProduct.price} 
                  className="font-semibold"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1"
                  onClick={() => addToCart(featuredProduct)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Link to="/menu" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Menu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
