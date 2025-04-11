import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product, User, PaymentMethod } from '@/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface Category {
  id: string;
  name: string;
}

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // User
  user: User | null;
  login: (id: string, name: string, role: 'admin' | 'customer') => void;
  logout: () => void;

  // Products
  allProducts: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Payment
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;

  // Contants
  title: string;

  // New fields
  categories: Category[];
  loading: boolean;

  // New function
  createOrder: (orderData: OrderData) => Promise<any>;
}

interface OrderData {
  total_amount: number;
  payment_method: string;
  payment_status: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');

      if (categoriesError) throw categoriesError;

      // Fetch products with category details
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          category_id,
          image_url,
          is_notes_required,
          created_at
        `)
        .order('name');

      if (productsError) {
        console.error('Products error:', productsError);
        throw productsError;
      }

      console.log('Fetched products:', productsData); // Debug log
      setAllProducts(productsData);

      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load menu data"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart functions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} x${quantity} added`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // User functions
  const login = (id: string, name: string, role: 'admin' | 'customer') => {
    setUser({
      id,
      name,
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Product functions
  const addProduct = (product: Product) => {
    const newProduct = { 
      ...product,
      id: Date.now().toString()
    };
    setAllProducts(prev => [...prev, newProduct]);
    toast({
      title: "Product added",
      description: `${product.name} has been added to your menu`,
    });
  };

  const updateProduct = (product: Product) => {
    setAllProducts(prev => 
      prev.map(p => p.id === product.id ? product : p)
    );
    toast({
      title: "Product updated",
      description: `${product.name} has been updated`,
    });
  };

  const deleteProduct = (productId: string) => {
    setAllProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Product deleted",
      description: "The product has been removed from your menu",
    });
  };

  const title = "Migoy's Burger Bunsuran I";

  const createOrder = async (orderData: OrderData) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Get the next order number
      const { data: orderNumber, error: orderNumberError } = await supabase
        .rpc('get_next_order_number');

      if (orderNumberError) throw orderNumberError;

      // Create the order with the sequential number
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status,
          order_status: 'completed',
          amount_paid: orderData.amount_paid,
          change: orderData.change
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Then create all order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          orderData.items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal
          }))
        );

      if (itemsError) throw itemsError;

      // Clear the cart after successful order
      clearCart();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    user,
    login,
    logout,
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    title,
    categories,
    loading,
    createOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};