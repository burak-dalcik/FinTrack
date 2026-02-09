export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  phone?: string;
  taxNumber?: string;
  address?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  taxNumber?: string;
  balance: number;
}

