export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  is_available: boolean;
  created_at: string;
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

export interface AppContextType {
  allProducts: Product[];
  categories: Category[];
  cartItems: CartItem[];  // Add this line
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
  createOrder: (orderData: OrderData) => Promise<any>;
}

export interface OrderData {
  total_amount: number;
  payment_method: string;
  payment_status: string;
  items: OrderItem[];
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}