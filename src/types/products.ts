export type ProductOrServiceType = "product" | "service";

export interface ProductOrService {
  id: string;
  currency: string;
  description?: string;
  name: string;
  notes?: string;
  price: number;
  sku: string;
  type: ProductOrServiceType;
  vatRate: number;
  businessId?: string;
}

