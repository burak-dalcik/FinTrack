import { bffClient } from "./apiClient";

export interface IncomeExpenseReport {
  fromDate: string;
  toDate: string;
  totalIncome: number;
  totalExpense: number;
}

export interface BalanceRow {
  name: string;
  balance: number;
}

export interface BalanceReport {
  rows: BalanceRow[];
}

export const reportService = {
  async incomeExpense(fromDate: string, toDate: string): Promise<IncomeExpenseReport> {
    // Assuming BFF exposes a consolidated income/expense report API
    const res = await bffClient.get("/v1/reports/income-expense", {
      params: { fromDate, toDate }
    });
    const body: any = res.data;
    return {
      fromDate,
      toDate,
      totalIncome: Number(body.totalIncome ?? 0),
      totalExpense: Number(body.totalExpense ?? 0)
    };
  },
  async customerBalances(fromDate: string, toDate: string): Promise<BalanceReport> {
    const res = await bffClient.get("/v1/reports/customer-balances", {
      params: { fromDate, toDate }
    });
    const body: any = res.data;
    const rows: BalanceRow[] = body.rows ?? body.customers ?? [];
    return { rows };
  },
  async supplierBalances(fromDate: string, toDate: string): Promise<BalanceReport> {
    const res = await bffClient.get("/v1/reports/supplier-balances", {
      params: { fromDate, toDate }
    });
    const body: any = res.data;
    const rows: BalanceRow[] = body.rows ?? body.suppliers ?? [];
    return { rows };
  }
};

