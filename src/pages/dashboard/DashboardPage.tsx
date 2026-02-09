import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invoiceService } from "../../services/invoiceService";
import { Invoice, InvoiceStatus } from "../../types/invoices";
import { formatMoney } from "../../utils/format";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [salesInvoices, setSalesInvoices] = useState<Invoice[]>([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock summary data to match the design (would come from reportService in real app)
  const summary = {
    income: 12450.0,
    incomeTrend: 12,
    expense: 8320.0,
    expenseTrend: 5,
    receivables: 4100.0,
    pendingInvoices: 8,
    payables: 2150.0,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sales, purchases] = await Promise.all([
          invoiceService.list({ type: "sales", page: 1, pageSize: 5 }),
          invoiceService.list({ type: "purchase", page: 1, pageSize: 5 }),
        ]);
        setSalesInvoices(sales.items);
        setPurchaseInvoices(purchases.items);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "unpaid":
        return "bg-slate-100 dark:bg-slate-800 text-slate-500";
      case "overdue":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "partial":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-500";
    }
  };

  return (
    <div>
      {/* Page Heading & Date Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0d141b] dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your business performance and outstanding items.
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex">
          <label className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm text-slate-500 has-[:checked]:text-primary transition-all">
            <span>Today</span>
            <input className="hidden" name="date-filter" type="radio" />
          </label>
          <label className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm text-slate-500 has-[:checked]:text-primary transition-all">
            <span>This Month</span>
            <input defaultChecked className="hidden" name="date-filter" type="radio" />
          </label>
          <label className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm text-slate-500 has-[:checked]:text-primary transition-all">
            <span>Custom</span>
            <input className="hidden" name="date-filter" type="radio" />
          </label>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-full"></div>
          <p className="text-sm font-semibold text-slate-500 mb-2">Total Income</p>
          <p className="text-2xl font-black text-green-600">
            {formatMoney(summary.income)}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>{summary.incomeTrend}% vs last month</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full"></div>
          <p className="text-sm font-semibold text-slate-500 mb-2">Total Expense</p>
          <p className="text-2xl font-black text-orange-600">
            {formatMoney(summary.expense)}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full w-fit">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>{summary.expenseTrend}% vs last month</span>
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full"></div>
          <p className="text-sm font-semibold text-slate-500 mb-2">
            Outstanding Receivables
          </p>
          <p className="text-2xl font-black text-primary">
            {formatMoney(summary.receivables)}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 dark:bg-primary/20 px-2 py-1 rounded-full w-fit">
            <span className="material-symbols-outlined text-[14px]">pending_actions</span>
            <span>{summary.pendingInvoices} Pending Invoices</span>
          </div>
        </div>

        {/* Outstanding Payables */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full"></div>
          <p className="text-sm font-semibold text-slate-500 mb-2">
            Outstanding Payables
          </p>
          <p className="text-2xl font-black text-red-600">
            {formatMoney(summary.payables)}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full w-fit">
            <span className="material-symbols-outlined text-[14px]">error_outline</span>
            <span>Due soon</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">
          Quick Actions
        </span>
        <button
          onClick={() => navigate("/invoices?type=sales&action=create")}
          className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Create Sales Invoice
        </button>
        <button
          onClick={() => navigate("/invoices?type=purchase&action=create")}
          className="bg-white dark:bg-slate-800 text-primary border border-primary/20 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            shopping_cart_checkout
          </span>
          Create Purchase Invoice
        </button>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales Invoices */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Sales Invoices</h3>
            <Link to="/invoices?type=sales" className="text-primary text-sm font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Invoice No
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salesInvoices.length === 0 && !loading && (
                   <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">No invoices found</td></tr>
                )}
                {salesInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm">{inv.customerId || "—"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      {formatMoney(inv.totalAmount)} {inv.currency}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusBadge(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchase Invoices */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Purchase Invoices</h3>
            <Link to="/invoices?type=purchase" className="text-primary text-sm font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Invoice No
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {purchaseInvoices.length === 0 && !loading && (
                   <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">No invoices found</td></tr>
                )}
                {purchaseInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm">{inv.supplierId || "—"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      {formatMoney(inv.totalAmount)} {inv.currency}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusBadge(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
