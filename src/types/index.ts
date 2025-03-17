
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export type PaymentMethod = 'gcash' | 'paymaya';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed';
  paymentMethod: PaymentMethod;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'customer';
}
