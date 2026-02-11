import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DataTable } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { formatDate, formatMoney } from "../../utils/format";
import { invoiceService } from "../../services/invoiceService";
import { Invoice, InvoiceStatus, InvoiceType } from "../../types/invoices";
import { InvoiceDetailPage } from "./InvoiceDetailPage"; // Import for type checking if needed, but we use route

const statusBadgeClass = (status: InvoiceStatus) => {
  switch (status) {
    case "paid":
      return "badge badge-success";
    case "overdue":
      return "badge badge-danger";
    case "partial":
      return "badge badge-warning";
    default:
      return "badge";
  }
};

export const InvoicesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as InvoiceType) || "sales";
  const initialAction = searchParams.get("action");

  const [tab, setTab] = useState<InvoiceType>(initialType);
  const { page, pageSize, setPage } = usePagination();
  const [items, setItems] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAction === "create") {
      navigate("/invoices/create");
    }
  }, [initialAction, navigate]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await invoiceService.list({
        type: tab,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        issueDateFrom: fromDate || undefined,
        issueDateTo: toDate || undefined,
        page,
        pageSize
      });
      setItems(res.items);
      setTotal(res.total);
    } catch {
      // swallow
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, statusFilter, fromDate, toDate, page, pageSize]);

  const handleTabChange = (newTab: InvoiceType) => {
    setTab(newTab);
    setPage(1);
    setSearchParams({ type: newTab });
  };

  const setIssueDateRange = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(1);
  };

  const applyDatePreset = (preset: string) => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    if (preset === "all") {
      setFromDate("");
      setToDate("");
    } else if (preset === "thisMonth") {
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 0);
      setIssueDateRange(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10));
    } else if (preset === "lastMonth") {
      const from = new Date(y, m - 1, 1);
      const to = new Date(y, m, 0);
      setIssueDateRange(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10));
    } else if (preset === "thisYear") {
      const from = new Date(y, 0, 1);
      const to = new Date(y, 11, 31);
      setIssueDateRange(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10));
    }
  };

  const datePresetValue =
    !fromDate && !toDate
      ? "all"
      : (() => {
          const now = new Date();
          const y = now.getFullYear();
          const m = now.getMonth();
          const thisMonthFrom = new Date(y, m, 1).toISOString().slice(0, 10);
          const thisMonthTo = new Date(y, m + 1, 0).toISOString().slice(0, 10);
          const lastMonthFrom = new Date(y, m - 1, 1).toISOString().slice(0, 10);
          const lastMonthTo = new Date(y, m, 0).toISOString().slice(0, 10);
          const thisYearFrom = new Date(y, 0, 1).toISOString().slice(0, 10);
          const thisYearTo = new Date(y, 11, 31).toISOString().slice(0, 10);
          if (fromDate === thisMonthFrom && toDate === thisMonthTo) return "thisMonth";
          if (fromDate === lastMonthFrom && toDate === lastMonthTo) return "lastMonth";
          if (fromDate === thisYearFrom && toDate === thisYearTo) return "thisYear";
          return "custom";
        })();

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {tab === 'sales' ? 'Sales Invoices' : 'Purchase Invoices'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your {tab === 'sales' ? 'income' : 'expenses'} and upload new receipts for OCR processing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/invoices/create" 
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Record New
          </Link>
          <button className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Upload Invoice
          </button>
        </div>
      </header>

      {/* Stats Grid (Quick View) - Mock Data for UI */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Unpaid</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$12,450.00</h3>
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error_outline</span> 8 invoices overdue
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Processing (OCR)</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">3</h3>
          <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">sync</span> Syncing with bank feed
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Documents Missing</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">14</h3>
          <div className="mt-2 text-xs text-slate-400 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">attach_file</span> Manual entries without PDF
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 items-center w-full md:w-auto">
           <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === 'sales' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              onClick={() => handleTabChange("sales")}
            >
              Sales
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === 'purchase' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              onClick={() => handleTabChange("purchase")}
            >
              Purchase
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" 
              placeholder="Search by supplier or invoice #..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as InvoiceStatus | "ALL");
              setPage(1);
            }}
          >
            <option value="ALL">All statuses</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partially Paid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary"
            value={datePresetValue}
            onChange={(e) => applyDatePreset(e.target.value)}
            title="Issue date range"
          >
            <option value="all">All time</option>
            <option value="thisMonth">This month</option>
            <option value="lastMonth">Last month</option>
            <option value="thisYear">This year</option>
            <option value="custom">Custom range</option>
          </select>

          <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <span className="hidden sm:inline">From</span>
            <input
              type="date"
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              title="Issue date from (day-month-year)"
            />
          </label>
          <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <span className="hidden sm:inline">To</span>
            <input
              type="date"
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              title="Issue date to (day-month-year)"
            />
          </label>
        </div>
      </section>

      {loading ? (
        <div className="centered">
          <div className="spinner" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <DataTable<Invoice>
            columns={[
              { header: "Date", accessor: (row) => <span className="text-slate-600 dark:text-slate-400 text-sm">{formatDate(row.issueDate)}</span> },
              { 
                header: tab === "sales" ? "Customer" : "Supplier", 
                accessor: (row) => <span className="font-medium text-slate-900 dark:text-white text-sm">{row.customerId || row.supplierId || "—"}</span> 
              },
              { 
                header: "Amount", 
                accessor: (row) => <span className="font-semibold text-slate-900 dark:text-white text-sm">{formatMoney(row.totalAmount)} {row.currency}</span> 
              },
              {
                header: "Status",
                accessor: (row) => (
                  <span className={statusBadgeClass(row.status)}>{row.status}</span>
                )
              },
              {
                header: "Document",
                accessor: (row) => (
                  <div className="flex justify-center">
                    <button className="text-slate-300 dark:text-slate-600 hover:text-primary transition-colors" title="View Document">
                      <span className="material-symbols-outlined text-xl">description</span>
                    </button>
                  </div>
                )
              },
              {
                header: "Actions",
                accessor: (row) => (
                  <div className="flex justify-end gap-2">
                     <button 
                      onClick={() => navigate(`/invoices/${row.id}`)}
                      className="text-primary hover:text-primary/70 transition-colors"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </div>
                )
              }
            ]}
            data={items}
            getRowKey={(r) => r.id}
            emptyMessage="No invoices found for this filter."
          />
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};
