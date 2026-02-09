import { paymentClient } from "./apiClient";
import { PagedResult } from "./invoiceService";
import { Payment } from "../types/payments";

export interface PaymentFilters {
  invoiceId?: string;
  method?: string;
  currency?: string;
  reference?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  date: string;
  invoiceId?: string;
  method?: string;
  notes?: string;
  payerName?: string;
  reference?: string;
}

export interface UpdatePaymentPayload {
  amount?: number;
  currency?: string;
  date?: string;
  invoiceId?: string;
  method?: string;
  notes?: string;
  payerName?: string;
  reference?: string;
}

export const paymentService = {
  async list(filters: PaymentFilters): Promise<PagedResult<Payment>> {
    const res = await paymentClient.get("/v1/payments", {
      params: {
        invoiceId: filters.invoiceId,
        method: filters.method,
        currency: filters.currency,
        reference: filters.reference,
        date: filters.date,
        pageNumber: filters.page,
        pageRowCount: filters.pageSize
      }
    });
    const body: any = res.data?.body || res.data;
    const items: Payment[] = body.payments ?? body.items ?? [];
    const total =
      Number(body?.paging?.totalRowCount ?? body?.rowCount ?? items.length) || items.length;
    return { items, total };
  },

  async get(id: string): Promise<Payment> {
    const res = await paymentClient.get(`/v1/payments/${id}`);
    const body: any = res.data?.body || res.data;
    return body.payment ?? body;
  },

  async create(payload: CreatePaymentPayload): Promise<Payment> {
    const res = await paymentClient.post("/v1/payments", { data: payload });
    const body: any = res.data?.body || res.data;
    return body.payment ?? body;
  },

  async update(id: string, payload: UpdatePaymentPayload): Promise<Payment> {
    const res = await paymentClient.put(`/v1/payments/${id}`, { data: payload });
    const body: any = res.data?.body || res.data;
    return body.payment ?? body;
  },

  async delete(id: string): Promise<void> {
    await paymentClient.delete(`/v1/payments/${id}`);
  }
};

