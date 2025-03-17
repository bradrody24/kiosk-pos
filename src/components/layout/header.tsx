
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronLeft, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showAdmin?: boolean;
}

export function Header({ title, showBack = false, showCart = true, showAdmin = true }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, user } = useApp();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="font-bold text-xl">{title || 'BurgerChain'}</div>
      </div>
      
      <div className="flex items-center gap-2">
        {showAdmin && !location.pathname.includes('/admin') && user?.role === 'admin' && (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        )}
        
        {showCart && !location.pathname.includes('/cart') && (
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
