import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

export function BottomNavigation() {
  const location = useLocation();
  const { cart } = useApp();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Don't show bottom navigation on admin pages
  if (location.pathname.includes('/admin')) {
    return null;
  }
  
  return (
    <nav className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
        <NavLink 
          to="/home" 
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </NavLink>
        
        <NavLink 
          to="/menu" 
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">Menu</span>
        </NavLink>
        
        <NavLink 
          to="/cart" 
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 relative",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-white">
              {cartItemCount}
            </span>
          )}
          <span className="text-xs">Cart</span>
        </NavLink>
        
        <NavLink 
          to="/account" 
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Account</span>
        </NavLink>
      </div>
    </nav>
  );
}
