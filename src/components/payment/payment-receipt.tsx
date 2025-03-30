import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Receipt } from '@/types/receipt';
import { downloadReceipt, printReceipt } from '@/utils/receipt-generator';
import { generateQueueNumber, printQueueTicket } from '@/utils/queue-generator';
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
  const [queueNumber] = useState(() => generateQueueNumber());
  
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
    change: orderDetails.change,
    queueNumber // Add queue number to receipt
  };

  const handlePrint = async () => {
    // Print receipt first
    await printReceipt(receipt);
    // Wait a bit before printing queue number
    setTimeout(async () => {
      await printQueueTicket(queueNumber);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="text-center mb-6">
          {/* <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground">Your order has been completed</p> */}
          <p className="text-lg font-bold mt-2">Queue #: {queueNumber}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Receipt No.:</span>
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
              <div key={index} className="flex justify-between font-bold">
                <span>
                  {item.quantity} x {item.product.name}
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
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt & Queue
            </Button>
            {/* <Button 
              className="flex-1" 
              variant="outline" 
              onClick={() => downloadReceipt(receipt)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button> */}
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

      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Queue Number</h2>
          <p className="text-4xl font-bold mt-4">{queueNumber}</p>
        </div>
        <Button
          className="w-full"
          onClick={() => printQueueTicket(queueNumber)}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Queue Number
        </Button>
      </Card>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
} 