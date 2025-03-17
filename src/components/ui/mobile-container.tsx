
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className={cn(
      "flex flex-col h-full w-full max-w-md mx-auto bg-background overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}
