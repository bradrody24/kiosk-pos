import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  order_number: number;
  created_at: string;
  total_amount: number;
  payment_method: string;
  order_items: OrderItem[];
  amount_paid: number;
  change: number;
}

interface ReceiptViewProps {
  order: Order;
}

export function ReceiptView({ order }: ReceiptViewProps) {
  return (
    <Card className="p-6 max-w-sm mx-auto bg-white">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">Migoy's Burger</h2>
        <p className="text-sm text-muted-foreground">Bunsuran 1st</p>
      </div>

      <div className="border-t border-b py-2 my-2">
        <div className="flex justify-between text-sm">
          <span>Order #{order.order_number}</span>
          <span>{format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}</span>
        </div>
      </div>

      <div className="space-y-2">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.product.name}</span>
            <span>₱{item.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-2 pt-2 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₱{order.total_amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Amount Paid</span>
          <span>₱{order.amount_paid?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Change</span>
          <span>₱{order.change?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>₱{order.total_amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Thank you for your purchase!</p>
      </div>
    </Card>
  );
} 