
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { CartItem } from '@/components/cart/cart-item';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, clearCart, cartTotal } = useApp();
  
  const isCartEmpty = cart.length === 0;
  
  return (
    <PageLayout title="Your Cart" showBack showCart={false}>
      <div className="p-4 pb-24">
        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/menu">
              <Button>View Menu</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Items</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground"
                onClick={clearCart}
              >
                <Trash className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
            
            <div className="space-y-1">
              {cart.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            
            {/* Order Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order before checkout</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceFormatter amount={cartTotal} />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup Fee</span>
                  <span>Free</span>
                </div>
                
                <div className="flex justify-between pt-3 border-t font-bold">
                  <span>Total</span>
                  <PriceFormatter amount={cartTotal} className="text-primary" />
                </div>
              </CardContent>
              
              <CardFooter>
                <Link to="/checkout" className="w-full">
                  <Button className="w-full">Proceed to Payment</Button>
                </Link>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default CartPage;
