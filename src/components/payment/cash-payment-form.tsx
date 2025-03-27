import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PriceFormatter } from "@/components/ui/price-formatter";

interface CashPaymentFormProps {
  totalAmount: number;
  onPaymentComplete: (cashAmount: number) => void;
}

export function CashPaymentForm({ totalAmount, onPaymentComplete }: CashPaymentFormProps) {
  const [cashAmount, setCashAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCashAmount(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(cashAmount);
    
    if (isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amount < totalAmount) {
      setError('Insufficient payment amount');
      return;
    }
    
    onPaymentComplete(amount);
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
          <div className="py-4 flex flex-col items-center font-bold text-lg">
            <span>Change:</span>
            <span className="text-8xl">
              <PriceFormatter amount={change > 0 ? change : 0} />
            </span>
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!cashAmount || parseFloat(cashAmount) < totalAmount}
      >
        Complete Payment
      </Button>
    </form>
  );
} 