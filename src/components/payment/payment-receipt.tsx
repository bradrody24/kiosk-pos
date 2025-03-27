import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Receipt } from '@/types/receipt';
import { downloadReceipt, printReceipt } from '@/utils/receipt-generator';
import { Printer, Download, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentReceiptProps {
  orderDetails: {
    orderId: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    cashReceived: number;
    change: number;
    date: Date;
  };
}

export function PaymentReceipt({ orderDetails }: PaymentReceiptProps) {
  const navigate = useNavigate();
  
  const receipt: Receipt = {
    id: orderDetails.orderId,
    date: orderDetails.date,
    items: orderDetails.items.map(item => ({
      product: {
        name: item.name,
        price: item.price
      },
      quantity: item.quantity
    })),
    subtotal: orderDetails.totalAmount,
    tax: 0, // Add tax calculation if needed
    total: orderDetails.totalAmount,
    amountPaid: orderDetails.cashReceived,
    change: orderDetails.change
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-muted-foreground">Your order has been completed</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Receipt Number:</span>
          <span className="font-mono">{receipt.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{receipt.date.toLocaleString()}</span>
        </div>
      </div>

      <div className="my-6">
        <div className="space-y-2">
          {receipt.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.quantity}x {item.product.name}
              </span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(receipt.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatCurrency(receipt.tax)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(receipt.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid</span>
            <span>{formatCurrency(receipt.amountPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span>Change</span>
            <span>{formatCurrency(receipt.change)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button 
            className="flex-1" 
            onClick={() => printReceipt(receipt)}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button 
            className="flex-1" 
            variant="outline" 
            onClick={() => downloadReceipt(receipt)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
        
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate('/menu')}
        >
          <Search className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
      </div>
    </Card>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
} 