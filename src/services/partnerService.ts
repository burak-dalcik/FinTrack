import { customerClient, supplierClient } from "./apiClient";
import { Supplier, Customer } from "../types/partners";
import { PagedResult } from "./invoiceService";

export const partnerService = {
  // SUPPLIERS (supplierManagement)
  async listSuppliers(page: number, pageSize: number): Promise<PagedResult<Supplier>> {
    const res = await supplierClient.get("/v1/suppliers", {
      params: {
        pageNumber: page,
        pageRowCount: pageSize
      }
    });
    const body: any = res.data?.body || res.data;
    const items: Supplier[] = body.suppliers ?? body.items ?? [];
    const total =
      Number(body?.paging?.totalRowCount ?? body?.rowCount ?? items.length) || items.length;
    return { items, total };
  },

  async createSupplier(payload: Partial<Supplier>): Promise<Supplier> {
    const res = await supplierClient.post("/v1/suppliers", { data: payload });
    const body: any = res.data?.body || res.data;
    return (body.supplier as Supplier) ?? (body.suppliers?.[0] as Supplier) ?? body;
  },

  async getSupplier(id: string): Promise<Supplier> {
    const res = await supplierClient.get(`/v1/suppliers/${id}`);
    const body: any = res.data?.body || res.data;
    return (body.supplier as Supplier) ?? body;
  },

  async updateSupplier(id: string, payload: Partial<Supplier>): Promise<Supplier> {
    const res = await supplierClient.put(`/v1/suppliers/${id}`, { data: payload });
    const body: any = res.data?.body || res.data;
    return (body.supplier as Supplier) ?? body;
  },

  async deleteSupplier(id: string): Promise<void> {
    await supplierClient.delete(`/v1/suppliers/${id}`);
  },

  // CUSTOMERS (customerManagement)
  async listCustomers(page: number, pageSize: number): Promise<PagedResult<Customer>> {
    const res = await customerClient.get("/v1/customers", {
      params: { pageNumber: page, pageRowCount: pageSize }
    });
    const body: any = res.data?.body || res.data;
    const items: Customer[] = body.customers ?? body.items ?? [];
    const total =
      Number(body?.paging?.totalRowCount ?? body?.rowCount ?? items.length) || items.length;
    return { items, total };
  },

  async createCustomer(payload: Partial<Customer>): Promise<Customer> {
    const res = await customerClient.post("/v1/customers", { data: payload });
    const body: any = res.data?.body || res.data;
    return (body.customer as Customer) ?? (body.customers?.[0] as Customer) ?? body;
  }
};


