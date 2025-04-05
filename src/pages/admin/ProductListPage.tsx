
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '@/types';

const ProductListPage = () => {
  const { allProducts, categories, deleteProduct, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Redirect if not admin (would typically be handled by a route guard)
  if (!user || user.role !== 'admin') {
    return (
      <PageLayout title="Unauthorized" showBottomNav={false}>
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold mb-4">Admin Access Required</h2>
          <p className="text-center text-muted-foreground mb-6">
            You need to be logged in as an admin to access this page.
          </p>
          <Link to="/account">
            <Button>Go to Account</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }
  
  // Filter products by category and search term
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
  };
  
  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };
  
  return (
    <PageLayout title="Manage Products" showBack showCart={false} showBottomNav={false}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Product List</h1>
          
          <Link to="/admin/products/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add New
            </Button>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="w-full h-auto flex mb-6 overflow-x-auto justify-start">
            <TabsTrigger value="all" className="flex-shrink-0">
              All
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex-shrink-0"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-0">
            {filteredProducts.length > 0 ? (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center border rounded-lg p-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground mr-2">
                          {categories.find(c => c.id === product.category_id)?.name}
                        </span>
                        <PriceFormatter amount={product.price} className="font-semibold" />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-3">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => confirmDelete(product)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No products found. Try a different search.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProductListPage;
