export interface ReceiptItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

export interface Receipt {
  id: string;
  date: Date;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  change: number;
} 