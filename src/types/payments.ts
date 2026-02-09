export interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: string;
  invoiceId?: string;
  method?: string;
  notes?: string;
  payerName?: string;
  reference?: string;
  businessId?: string;
}

// Legacy type - backend doesn't have direction, it's determined by invoice type
export type PaymentDirection = "INCOMING" | "OUTGOING";

