export type InvoiceType = "sales" | "purchase";

export type InvoiceStatus = "unpaid" | "partial" | "paid" | "overdue";

export interface InvoiceItem {
  id: string;
  description?: string;
  invoiceId: string;
  productOrServiceId: string;
  quantity: number;
  total: number;
  unitPrice: number;
  vatAmount: number;
  vatRate: number;
  businessId?: string;
}

export interface Invoice {
  id: string;
  currency: string;
  customerId?: string;
  dueDate: string;
  invoiceNumber: string;
  issueDate: string;
  notes?: string;
  status: InvoiceStatus;
  supplierId?: string;
  totalAmount: number;
  type: InvoiceType;
  businessId?: string;
}

// Legacy aliases for backwards compatibility
export type InvoiceLine = InvoiceItem;

