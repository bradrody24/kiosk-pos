
import React, { useEffect } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { cart } = useApp();
  
  // Redirect if no order was placed
  useEffect(() => {
    if (cart.length > 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  return (
    <PageLayout showBack={false} showCart={false} showBottomNav={false}>
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-bounce mb-6">
          <CheckCircle className="h-20 w-20 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold mb-3">Order Confirmed!</h1>
        
        <p className="text-muted-foreground mb-6">
          Your order has been received and is being prepared for pickup.
          You'll receive a notification when your order is ready.
        </p>
        
        <div className="rounded-lg bg-muted/30 p-4 mb-8 w-full max-w-xs">
          <p className="font-semibold mb-1">Order ID</p>
          <p className="text-muted-foreground text-sm mb-3">#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
          
          <p className="font-semibold mb-1">Pickup Location</p>
          <p className="text-muted-foreground text-sm">123 Burger Street, Metro Manila</p>
        </div>
        
        <Link to="/">
          <Button className="w-full">
            <Home className="h-4 w-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default ConfirmationPage;
