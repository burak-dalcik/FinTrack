export interface Expense {
  id: string;
  amount: number;
  category: string;
  currency: string;
  date: string;
  description: string;
  notes?: string;
  supplierId?: string;
  businessId?: string;
}

