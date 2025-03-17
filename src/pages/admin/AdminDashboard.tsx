
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Layers, Settings, ShoppingBasket } from 'lucide-react';

const AdminDashboard = () => {
  const { allProducts, user } = useApp();
  
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
  
  // Count products by category
  const categoryCount: Record<string, number> = {};
  allProducts.forEach(product => {
    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
  });
  
  return (
    <PageLayout title="Admin Dashboard" showBack showCart={false} showBottomNav={false}>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome, Admin</h1>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allProducts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(categoryCount).length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link to="/admin/products">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  Manage Products
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/admin/products/new">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <ShoppingBasket className="h-4 w-4 mr-2" />
                  Add New Product
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/admin/settings">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Store Settings
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Back to App */}
        <div className="pt-4">
          <Link to="/">
            <Button variant="default" className="w-full">
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
