
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { toast } from '@/components/ui/use-toast';
import { PaymentMethod } from '@/types';
import { Check, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, selectedPaymentMethod, setSelectedPaymentMethod } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isCartEmpty = cart.length === 0;
  
  // Redirect to cart if empty
  if (isCartEmpty) {
    navigate('/cart');
    return null;
  }
  
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !phoneNumber || !pickupTime || !selectedPaymentMethod) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      toast({
        title: "Order Placed!",
        description: `Your order will be ready for pickup at ${pickupTime}`,
      });
      
      clearCart();
      setSelectedPaymentMethod(null);
      navigate('/confirmation');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <PageLayout title="Checkout" showBack showCart={false} showBottomNav={false}>
      <form onSubmit={handleSubmit} className="p-4 pb-6">
        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input 
                  id="name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input 
                  id="phone" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+63"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="pickup" className="block text-sm font-medium mb-1">
                  Pickup Time
                </label>
                <Input 
                  id="pickup" 
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Store hours: 10:00 AM - 10:00 PM
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Payment Method */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Select your preferred payment method
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedPaymentMethod === 'gcash' 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handlePaymentMethodSelect('gcash')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-blue-500 text-white rounded p-1.5">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  {selectedPaymentMethod === 'gcash' && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="font-medium">GCash</div>
              </div>
              
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedPaymentMethod === 'paymaya' 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handlePaymentMethodSelect('paymaya')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-purple-500 text-white rounded p-1.5">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  {selectedPaymentMethod === 'paymaya' && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="font-medium">PayMaya</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            
            <div className="rounded-lg bg-muted/40 p-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between py-2">
                  <div>
                    <span className="font-medium">{item.quantity}x</span> {item.product.name}
                  </div>
                  <PriceFormatter amount={item.product.price * item.quantity} />
                </div>
              ))}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between py-2 font-bold">
                <div>Total</div>
                <PriceFormatter amount={cartTotal} className="text-primary" />
              </div>
            </div>
          </div>
          
          {/* Place Order Button */}
          <Button 
            type="submit" 
            className="w-full h-12" 
            disabled={isSubmitting || !selectedPaymentMethod}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default CheckoutPage;
