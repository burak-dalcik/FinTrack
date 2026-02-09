import { expenseClient } from "./apiClient";
import { PagedResult } from "./invoiceService";
import { Expense } from "../types/expenses";

export interface ExpenseFilters {
  category?: string;
  currency?: string;
  supplierId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateExpensePayload {
  amount: number;
  category: string;
  currency: string;
  date: string;
  description: string;
  notes?: string;
  supplierId?: string;
}

export interface UpdateExpensePayload {
  amount?: number;
  category?: string;
  currency?: string;
  date?: string;
  description?: string;
  notes?: string;
  supplierId?: string;
}

export const expenseService = {
  async list(filters: ExpenseFilters): Promise<PagedResult<Expense>> {
    const res = await expenseClient.get("/v1/expenses", {
      params: {
        category: filters.category,
        currency: filters.currency,
        supplierId: filters.supplierId,
        date: filters.fromDate,
        pageNumber: filters.page,
        pageRowCount: filters.pageSize
      }
    });
    const body: any = res.data?.body || res.data;
    const items: Expense[] = body.expenses ?? body.items ?? [];
    const total =
      Number(body?.paging?.totalRowCount ?? body?.rowCount ?? items.length) || items.length;
    return { items, total };
  },

  async get(id: string): Promise<Expense> {
    const res = await expenseClient.get(`/v1/expenses/${id}`);
    const body: any = res.data?.body || res.data;
    return body.expense ?? body;
  },

  async create(payload: CreateExpensePayload): Promise<Expense> {
    const res = await expenseClient.post("/v1/expenses", { data: payload });
    const body: any = res.data?.body || res.data;
    return body.expense ?? body;
  },

  async update(id: string, payload: UpdateExpensePayload): Promise<Expense> {
    const res = await expenseClient.put(`/v1/expenses/${id}`, { data: payload });
    const body: any = res.data?.body || res.data;
    return body.expense ?? body;
  },

  async delete(id: string): Promise<void> {
    await expenseClient.delete(`/v1/expenses/${id}`);
  }
};

