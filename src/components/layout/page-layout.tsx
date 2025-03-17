
import React from 'react';
import { Header } from './header';
import { BottomNavigation } from './bottom-navigation';
import { MobileContainer } from '@/components/ui/mobile-container';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showBottomNav?: boolean;
  showAdmin?: boolean;
  contentClassName?: string;
}

export function PageLayout({ 
  children, 
  title, 
  showBack = false, 
  showCart = true, 
  showBottomNav = true,
  showAdmin = true,
  contentClassName 
}: PageLayoutProps) {
  return (
    <MobileContainer>
      <Header title={title} showBack={showBack} showCart={showCart} showAdmin={showAdmin} />
      
      <main className={cn(
        "flex-1 overflow-y-auto pb-16",
        contentClassName
      )}>
        {children}
      </main>
      
      {showBottomNav && <BottomNavigation />}
    </MobileContainer>
  );
}
