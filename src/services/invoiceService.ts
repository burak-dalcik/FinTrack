import { invoiceClient } from "./apiClient";
import { Invoice, InvoiceItem, InvoiceStatus, InvoiceType } from "../types/invoices";

export interface InvoiceFilters {
  type?: InvoiceType;
  status?: InvoiceStatus;
  customerId?: string;
  supplierId?: string;
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  page?: number;
  pageSize?: number;
}

export interface InvoiceItemFilters {
  invoiceId?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export interface CreateInvoicePayload {
  type: InvoiceType;
  currency: string;
  customerId?: string;
  supplierId?: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  notes?: string;
}

export interface UpdateInvoicePayload {
  currency?: string;
  customerId?: string;
  supplierId?: string;
  dueDate?: string;
  invoiceNumber?: string;
  issueDate?: string;
  notes?: string;
}

export interface CreateInvoiceItemPayload {
  invoiceId: string;
  productOrServiceId: string;
  quantity: number;
  description?: string;
  unitPrice?: number;
  vatRate?: number;
}

export interface UpdateInvoiceItemPayload {
  description?: string;
  productOrServiceId?: string;
  quantity?: number;
  unitPrice?: number;
  vatRate?: number;
}

export const invoiceService = {
  // Invoice CRUD
  async list(filters: InvoiceFilters): Promise<PagedResult<Invoice>> {
    const response = await invoiceClient.get("/v1/invoices", {
      params: {
        type: filters.type,
        status: filters.status,
        customerId: filters.customerId,
        supplierId: filters.supplierId,
        invoiceNumber: filters.invoiceNumber,
        issueDate: filters.issueDate,
        dueDate: filters.dueDate,
        pageNumber: filters.page,
        pageRowCount: filters.pageSize
      }
    });

    const body: any = response.data?.body || response.data;
    const items: Invoice[] = body.invoices ?? body.items ?? [];
    const total =
      Number(body?.paging?.totalRowCount ?? body?.rowCount ?? items.length) || items.length;

    return { items, total };
  },

  async get(id: string): Promise<Invoice> {
    const response = await invoiceClient.get(`/v1/invoices/${id}`);
    const body: any = response.data?.body || response.data;
    return body.invoice ?? body;
  },

  async create(payload: CreateInvoicePayload): Promise<Invoice> {
    const response = await invoiceClient.post("/v1/invoices", { data: payload });
    const body: any = response.data?.body || response.data;
    return body.invoice ?? body;
  },

  async update(id: string, payload: UpdateInvoicePayload): Promise<Invoice> {
    const response = await invoiceClient.put(`/v1/invoices/${id}`, { data: payload });
    const body: any = response.data?.body || response.data;
    return body.invoice ?? body;
  },

  async delete(id: string): Promise<void> {
    await invoiceClient.delete(`/v1/invoices/${id}`);
  },

  // Invoice Items CRUD
  async listItems(filters: InvoiceItemFilters): Promise<PagedResult<InvoiceItem>> {
    const response = await invoiceClient.get("/v1/invoiceitems", {
      params: {
        invoiceId: filters.invoiceId,
        pageNumber: filters.page,
        pageRowCount: filters.pageSize
      }
    });

    const body: any = response.data?.body || response.data;
    const items: InvoiceItem[] = body.invoiceItems ?? body.invoiceitems ?? body.items ?? [];
    const total =
      Number(body?.paging?.totalRowCount ?? body?.rowCount ?? items.length) || items.length;

    return { items, total };
  },

  async getItem(id: string): Promise<InvoiceItem> {
    const response = await invoiceClient.get(`/v1/invoiceitems/${id}`);
    const body: any = response.data?.body || response.data;
    return body.invoiceItem ?? body.invoiceitem ?? body;
  },

  async createItem(payload: CreateInvoiceItemPayload): Promise<InvoiceItem> {
    const response = await invoiceClient.post("/v1/invoiceitems", { data: payload });
    const body: any = response.data?.body || response.data;
    return body.invoiceItem ?? body.invoiceitem ?? body;
  },

  async updateItem(id: string, payload: UpdateInvoiceItemPayload): Promise<InvoiceItem> {
    const response = await invoiceClient.put(`/v1/invoiceitems/${id}`, { data: payload });
    const body: any = response.data?.body || response.data;
    return body.invoiceItem ?? body.invoiceitem ?? body;
  },

  async deleteItem(id: string): Promise<void> {
    await invoiceClient.delete(`/v1/invoiceitems/${id}`);
  }
};

