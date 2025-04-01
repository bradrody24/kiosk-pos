import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ReceiptView } from '@/components/receipt/receipt-view';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  created_at: string;
  total_amount: number;
  payment_method: string;
  order_items: OrderItem[];
}

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const fetchTodayOrders = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              name
            )
          )
        `)
        .eq('order_status', 'completed')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sales data"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = (order: Order) => {
    setSelectedOrder(order);
  };

  if (loading) {
    return (
      <PageLayout title="Today's Sales">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Today's Sales" showBack showCart={false}>
      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sales recorded for today
          </div>
        ) : (
          <>
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Total Sales: ₱{orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
            </div>
            {orders.map((order) => (
              <Card key={order.id} className="p-4 hover:bg-primary/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      #{order.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'h:mm a')}
                    </div>
                    <div className="text-sm font-medium">
                      ₱{order.total_amount.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePrintReceipt(order)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Receipt className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
      
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogTitle>Order Receipt</DialogTitle>
          <DialogDescription>
            View and print order details
          </DialogDescription>
          {selectedOrder && <ReceiptView order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
} 