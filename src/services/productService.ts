import { productClient } from "./apiClient";
import { PagedResult } from "./invoiceService";
import { ProductOrService, ProductOrServiceType } from "../types/products";

export interface ProductFilters {
  name?: string;
  sku?: string;
  type?: ProductOrServiceType;
  currency?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateProductPayload {
  currency: string;
  name: string;
  price: number;
  sku: string;
  type: ProductOrServiceType;
  vatRate: number;
  description?: string;
  notes?: string;
}

export interface UpdateProductPayload {
  currency?: string;
  name?: string;
  price?: number;
  sku?: string;
  type?: ProductOrServiceType;
  vatRate?: number;
  description?: string;
  notes?: string;
}

export const productService = {
  async list(filters: ProductFilters): Promise<PagedResult<ProductOrService>> {
    const res = await productClient.get("/v1/productorservices", {
      params: {
        name: filters.name,
        sku: filters.sku,
        type: filters.type,
        currency: filters.currency,
        pageNumber: filters.page,
        pageRowCount: filters.pageSize,
      },
    });
    const body: any = res.data?.body || res.data;
    const items: ProductOrService[] = body.productOrServices ?? body.items ?? [];
    const total =
      Number(body?.paging?.totalRowCount ?? body?.rowCount ?? items.length) || items.length;
    return { items, total };
  },

  async get(id: string): Promise<ProductOrService> {
    const res = await productClient.get(`/v1/productorservices/${id}`);
    const body: any = res.data?.body || res.data;
    return (body.productOrService as ProductOrService) ?? body;
  },

  async create(payload: CreateProductPayload): Promise<ProductOrService> {
    const res = await productClient.post("/v1/productorservices", { data: payload });
    const body: any = res.data?.body || res.data;
    return (body.productOrService as ProductOrService) ?? body;
  },

  async update(id: string, payload: UpdateProductPayload): Promise<ProductOrService> {
    const res = await productClient.put(`/v1/productorservices/${id}`, { data: payload });
    const body: any = res.data?.body || res.data;
    return (body.productOrService as ProductOrService) ?? body;
  },

  async delete(id: string): Promise<void> {
    await productClient.delete(`/v1/productorservices/${id}`);
  },
};

