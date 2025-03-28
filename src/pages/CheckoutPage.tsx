import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/page-layout';
import { CashPaymentForm } from '@/components/payment/cash-payment-form';
import { PaymentReceipt } from '@/components/payment/payment-receipt';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceFormatter } from '@/components/ui/price-formatter';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useApp();
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const totalAmount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handlePaymentComplete = (cashAmount: number) => {
    const orderDetails = {
      orderId: `ORD${Date.now()}`,
      items: cart.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      totalAmount,
      cashReceived: cashAmount,
      change: cashAmount - totalAmount,
      date: new Date(),
    };
    
    setPaymentDetails(orderDetails);
    setShowReceipt(true);
    clearCart();
  };

  return (
    <PageLayout 
      title={showReceipt ? "Receipt" : "Checkout"} 
      showBack={!showReceipt}
      showCart={false}
    >
      <div className="p-4 pb-24">
        {!showReceipt ? (
          <>
            {/* Order Summary Card */}
            <Card className="mt-6 mb-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order before payment</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceFormatter amount={totalAmount} />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span><PriceFormatter amount={0.00} /></span>
                </div>
                
                <div className="flex justify-between pt-3 border-t font-bold">
                  <span>Total</span>
                  <PriceFormatter amount={totalAmount} className="text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Cash Payment Form */}
            <CashPaymentForm 
              items={cart}
              totalAmount={totalAmount}
              onPaymentComplete={handlePaymentComplete}
            />
          </>
        ) : (
          <PaymentReceipt orderDetails={paymentDetails} />
        )}
      </div>
    </PageLayout>
  );
}
