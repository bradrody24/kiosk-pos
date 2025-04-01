import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/page-layout';
import { CashPaymentForm } from '@/components/payment/cash-payment-form';
import { PaymentReceipt } from '@/components/payment/payment-receipt';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceFormatter } from '@/components/ui/price-formatter';
import { toast } from '@/components/ui/use-toast';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal, createOrder } = useApp();
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (cartTotal === 0 && !showReceipt) {
      navigate('/menu');
    }
  }, [cartTotal, navigate, showReceipt]);

  const totalAmount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handlePaymentComplete = async (cashAmount: number) => {
    try {
      // Create order data
      const orderData = {
        total_amount: totalAmount,
        payment_method: 'cash',
        payment_status: 'completed',
        amount_paid: cashAmount,
        change: cashAmount - totalAmount,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          subtotal: item.product.price * item.quantity
        }))
      };

      // Create order and get the response
      const order = await createOrder(orderData);
      
      // Update payment details with the new order number
      const orderDetails = {
        orderId: order.order_number, // Use the new order number
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
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your order. Please try again."
      });
    }
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
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceFormatter amount={totalAmount} />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span><PriceFormatter amount={0.00} /></span>
                </div> */}
                
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
