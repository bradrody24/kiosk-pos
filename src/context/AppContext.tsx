import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product, User, PaymentMethod } from '@/types';
import { products } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  login: (role: 'admin' | 'customer') => void;
  logout: () => void;

  // Products
  allProducts: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Payment
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;

  // Authentication
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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

  const login = (role: 'admin' | 'customer') => {
    setUser({
      id: '1',
      name: role === 'admin' ? 'Admin User' : 'Customer',
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

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

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user) {
        // Set user data if needed
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
    }
  };

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        // Set user data if needed
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    isAuthenticated,
    checkSession
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
