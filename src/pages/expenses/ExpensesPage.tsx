import { useEffect, useState, FormEvent } from "react";
import { DataTable } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { Modal } from "../../components/ui/Modal";
import { usePagination } from "../../hooks/usePagination";
import { formatDate, formatMoney } from "../../utils/format";
import { expenseService } from "../../services/expenseService";
import { Expense } from "../../types/expenses";

export const ExpensesPage = () => {
  const { page, pageSize, setPage } = usePagination();
  const [items, setItems] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [form, setForm] = useState<{
    date: string;
    category: string;
    description: string;
    amount: number;
    currency: string;
    notes?: string;
    supplierId?: string;
  }>({
    date: new Date().toISOString().slice(0, 10),
    category: "",
    description: "",
    amount: 0,
    currency: "TRY"
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await expenseService.list({
        category: categoryFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        pageSize
      });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, fromDate, toDate, page, pageSize]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.description) return;
    setSaving(true);
    try {
      await expenseService.create({
        amount: form.amount,
        category: form.category,
        currency: form.currency,
        date: form.date,
        description: form.description,
        notes: form.notes,
        supplierId: form.supplierId
      });
      setOpen(false);
      setForm({
        date: new Date().toISOString().slice(0, 10),
        category: "",
        description: "",
        amount: 0,
        currency: "TRY"
      });
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading + CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Expenses
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and track your business spending and reimbursements.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm"
          onClick={() => setOpen(true)}
        >
          <span className="material-symbols-outlined">add</span>
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Stats Summary (mock values for now) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total This Month
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatMoney(12450)}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Reimbursements
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatMoney(840.5)}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <span className="material-symbols-outlined">trending_down</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Budget Remaining
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatMoney(4550)}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <span className="material-symbols-outlined">receipt</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Subscriptions
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">14</p>
          </div>
        </div>
      </div>

      {/* Filters + Table */}
      <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-4">
        {/* Filters row */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary placeholder:text-slate-400"
              placeholder="Search transactions, vendors, or descriptions..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="appearance-none bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-primary min-w-[140px]"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Categories</option>
                <option value="Supplies">Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Software">Software</option>
                <option value="Marketing">Marketing</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                expand_more
              </span>
            </div>
            <div className="relative">
              <input
                type="date"
                className="appearance-none bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-primary min-w-[140px]"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                calendar_today
              </span>
            </div>
            <button className="flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="centered">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <DataTable<Expense>
                columns={[
                  { header: "Date", accessor: (r) => formatDate(r.date) },
                  { header: "Category", accessor: "category" },
                  { header: "Description", accessor: "description" },
                  { 
                    header: "Amount", 
                    accessor: (r) => `${formatMoney(r.amount)} ${r.currency}` 
                  },
                  { 
                    header: "Notes", 
                    accessor: (r) => r.notes ? (r.notes.length > 30 ? r.notes.slice(0, 30) + "..." : r.notes) : "—" 
                  }
                ]}
                data={items}
                getRowKey={(r) => r.id}
                emptyMessage="No expenses recorded."
              />
            </div>
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {items.length > 0 ? 1 : 0}-{items.length} of {total} expenses
              </p>
              <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* New expense modal */}
      <Modal title="New Expense" open={open} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={submit}>
          <div className="filters-row">
            <label className="form-label">
              Date <span className="text-red-500">*</span>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            </label>
            <label className="form-label">
              Category <span className="text-red-500">*</span>
              <input
                className="input"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. utilities, travel"
                required
              />
            </label>
          </div>
          <div className="filters-row">
            <label className="form-label">
              Amount <span className="text-red-500">*</span>
              <input
                type="number"
                className="input"
                value={form.amount}
                min={0}
                step="0.01"
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) || 0 }))
                }
                required
              />
            </label>
            <label className="form-label">
              Currency <span className="text-red-500">*</span>
              <select
                className="input"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                required
              >
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
          </div>
          <label className="form-label">
            Description <span className="text-red-500">*</span>
            <input
              className="input"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Purpose or detail of expense"
              required
            />
          </label>
          <label className="form-label">
            Notes (Optional)
            <textarea
              className="input"
              rows={3}
              value={form.notes ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Internal notes or justification"
            />
          </label>
          <label className="form-label">
            Supplier ID (Optional)
            <input
              className="input"
              value={form.supplierId ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
              placeholder="Link to a known supplier"
            />
          </label>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!form.category || !form.amount || !form.description || saving}
          >
            {saving ? "Saving..." : "Save Expense"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

