import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PriceFormatter } from "@/components/ui/price-formatter";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { useToast } from "@/components/ui/use-toast";

interface CashPaymentFormProps {
  totalAmount: number;
  onPaymentComplete: () => void;
}

export function CashPaymentForm({ totalAmount, onPaymentComplete }: CashPaymentFormProps) {
  const { cart, createOrder, clearCart } = useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cart Items:', cart); // Debug log

    if (!cart || cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Your cart is empty"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const orderData = {
        total_amount: totalAmount,
        payment_method: 'cash',
        payment_status: 'completed',
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          subtotal: item.product.price * item.quantity
        }))
      };

      console.log('Order Data:', orderData); // Debug log
      await createOrder(orderData);
      
      toast({
        title: "Order Successful",
        description: "Your order has been placed successfully!",
        className: "bg-green-500 text-white",
      });
      onPaymentComplete();
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your order. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const [cashAmount, setCashAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCashAmount(value);
      setError('');
    }
  };

  const change = cashAmount ? parseFloat(cashAmount) - totalAmount : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Cash Amount</label>
        <Input
          type="text"
          inputMode="decimal"
          value={cashAmount}
          onChange={handleCashAmountChange}
          placeholder="Enter cash amount"
          className="text-lg font-bold"
          autoFocus
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {cashAmount && !isNaN(parseFloat(cashAmount)) && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Total Amount:</span>
            <PriceFormatter amount={totalAmount} />
          </div>
          <div className="flex justify-between mb-2">
            <span>Cash Received:</span>
            <PriceFormatter amount={parseFloat(cashAmount) || 0} />
          </div>
          <div className="py-2 flex flex-col items-center font-bold text-lg">
            <span>Change:</span>
            <span className="text-6xl">
              <PriceFormatter amount={change > 0 ? change : 0} />
            </span>
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!cashAmount || parseFloat(cashAmount) < totalAmount}
        onClick={handleSubmit}
      >
        Complete Payment
      </Button>
    </form>
  );
} 