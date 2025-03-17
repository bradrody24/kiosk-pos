
import React from 'react';

interface PriceFormatterProps {
  amount: number;
  className?: string;
}

export function PriceFormatter({ amount, className }: PriceFormatterProps) {
  const formattedPrice = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);

  return (
    <span className={className}>{formattedPrice}</span>
  );
}
