import { useEffect, useState, FormEvent } from "react";
import { DataTable } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { Modal } from "../../components/ui/Modal";
import { usePagination } from "../../hooks/usePagination";
import { formatMoney } from "../../utils/format";
import { partnerService } from "../../services/partnerService";
import { Customer } from "../../types/partners";

export const CustomersPage = () => {
  const { page, pageSize, setPage } = usePagination();
  const [items, setItems] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<Partial<Customer>>({ name: "", contactName: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await partnerService.listCustomers(page, pageSize);
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      await partnerService.createCustomer(form);
      setOpen(false);
      setForm({ name: "", contactName: "" });
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top heading & actions */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-black tracking-tight mb-2">Customers</h2>
          <p className="text-[#4c739a] dark:text-slate-400 text-sm md:text-base">
            Keep track of your client relationships, outstanding payments, and recent interactions in one place.
          </p>
        </div>
        <button
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
          onClick={() => setOpen(true)}
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add Customer</span>
        </button>
      </div>

      {/* Stats summary (mock for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-[#cfdbe7] dark:border-slate-800 shadow-sm">
          <p className="text-[#4c739a] text-sm font-medium mb-1">Active Customers</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{total}</h3>
            <span className="text-[#078838] text-xs font-bold">+12%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-[#cfdbe7] dark:border-slate-800 shadow-sm">
          <p className="text-[#4c739a] text-sm font-medium mb-1">Total Outstanding</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{formatMoney(42910)}</h3>
            <span className="text-[#e73908] text-xs font-bold">-4%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-[#cfdbe7] dark:border-slate-800 shadow-sm">
          <p className="text-[#4c739a] text-sm font-medium mb-1">Overdue Balance</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{formatMoney(3420)}</h3>
            <span className="bg-[#e73908]/10 text-[#e73908] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Critical
            </span>
          </div>
        </div>
      </div>

      {/* Search + Filters + Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-6 py-4 border-b border-[#e7edf3] dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c739a] text-xl">
              search
            </span>
            <input
              className="w-full bg-[#f6f7f8] dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-[#4c739a]"
              placeholder="Search customers by name, email, or contact..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4c739a] border border-[#e7edf3] dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4c739a] border border-[#e7edf3] dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Table area */}
        {loading ? (
          <div className="centered">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <DataTable<Customer>
                columns={[
                  { header: "Customer Name", accessor: "name" },
                  { header: "Primary Contact", accessor: "contactName" },
                  { header: "Email Address", accessor: "email" },
                  { header: "Outstanding Balance", accessor: (r) => formatMoney(r.balance) },
                  { header: "Last Activity", accessor: () => "—" },
                  {
                    header: "Health",
                    accessor: () => (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wide">
                        Healthy
                      </span>
                    )
                  }
                ]}
                data={items}
                getRowKey={(r) => r.id}
                emptyMessage="No customers yet."
              />
            </div>
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
              <p className="text-xs text-[#4c739a] font-medium">
                Showing {items.length > 0 ? 1 : 0}-{items.length} of {total} customers
              </p>
              <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* New customer modal */}
      <Modal title="New Customer" open={open} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={submit}>
          <label className="form-label">
            Name
            <input
              className="input"
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </label>
          <label className="form-label">
            Contact Name
            <input
              className="input"
              value={form.contactName ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
            />
          </label>
          <label className="form-label">
            Phone
            <input
              className="input"
              value={form.phone ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>
          <label className="form-label">
            Email
            <input
              type="email"
              className="input"
              value={form.email ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={!form.name || saving}>
            {saving ? "Saving..." : "Save Customer"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

