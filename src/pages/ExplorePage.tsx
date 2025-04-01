import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Receipt, 
  Package, 
  Settings, 
  Users, 
  BarChart,
  CreditCard,
  Printer,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Point of Sale',
    description: 'Process transactions and manage sales',
    icon: ShoppingCart,
    path: '/pos',
    color: 'bg-blue-500',
    steps: [
      'Add items to cart',
      'Process payments',
      'Print receipts'
    ]
  },
  {
    title: 'Sales History',
    description: 'Track and view all transactions',
    icon: Receipt,
    path: '/sales',
    color: 'bg-green-500',
    steps: [
      'View daily sales',
      'Check transaction details',
      'Print past receipts'
    ]
  },
  {
    title: 'Product Management',
    description: 'Manage your inventory and products',
    icon: Package,
    path: '/products',
    color: 'bg-purple-500',
    steps: [
      'Add new products',
      'Update stock levels',
      'Set prices'
    ]
  },
  {
    title: 'Sales Analytics',
    description: 'View reports and insights',
    icon: BarChart,
    path: '/reports',
    color: 'bg-red-500',
    steps: [
      'Daily sales reports',
      'Product performance',
      'Revenue analytics'
    ]
  },
  {
    title: 'System Settings',
    description: 'Configure your POS system',
    icon: Settings,
    path: '/settings',
    color: 'bg-gray-500',
    steps: [
      'Payment methods',
      'Printer settings',
      'System preferences'
    ]
  }
];

export default function ExplorePage() {
  const navigate = useNavigate();

  return (
    <PageLayout title="Explore Features" showBack showCart={false}>
      <div className="p-4 space-y-6">
        {features.map((feature, index) => (
          <Card 
            key={feature.title}
            className="p-4 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(feature.path)}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${feature.color} text-white shrink-0`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {feature.steps.map((step) => (
                    <span 
                      key={step}
                      className="text-xs bg-muted px-2 py-1 rounded-full"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
} 