import { useEffect, useState, FormEvent } from "react";
import { DataTable } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { Drawer } from "../../components/ui/Drawer";
import { usePagination } from "../../hooks/usePagination";
import { partnerService } from "../../services/partnerService";
import { Supplier } from "../../types/partners";
import { getBusinessCodename } from "../../services/apiClient";

export const SuppliersPage = () => {
  const { page, pageSize, setPage } = usePagination();
  const [items, setItems] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const tenantId = getBusinessCodename();

  const [form, setForm] = useState<Partial<Supplier>>({
    name: "",
    contactName: "",
    contactEmail: "",
    phone: "",
    taxNumber: "",
    address: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await partnerService.listSuppliers(page, pageSize);
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
    
    // Clean up payload: remove empty strings for optional fields
    const payload = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );

    try {
      if (form.id) {
        await partnerService.updateSupplier(form.id, payload);
      } else {
        await partnerService.createSupplier(payload);
      }
      setOpen(false);
      resetForm();
      await load();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save supplier: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      contactName: "",
      contactEmail: "",
      phone: "",
      taxNumber: "",
      address: "",
      notes: "",
    });
  };

  const handleEdit = (supplier: Supplier) => {
    setForm(supplier);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Suppliers
            </h1>
            <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/10">
              Tenant: {tenantId}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your vendor relationships and procurement data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Name or Tax ID"
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-sm shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <DataTable<Supplier>
              columns={[
                {
                  header: "Supplier Name",
                  accessor: (r) => (
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {r.name}
                    </div>
                  ),
                },
                { header: "Tax Number", accessor: (r) => r.taxNumber || "—" },
                {
                  header: "Contact",
                  accessor: (r) => (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{r.contactName || "—"}</span>
                      <span className="text-xs text-slate-500">{r.phone}</span>
                    </div>
                  ),
                },
                { header: "Email", accessor: (r) => r.contactEmail || "—" },
                {
                  header: "Status",
                  accessor: () => (
                    <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                  ),
                },
                {
                  header: "",
                  accessor: (r) => (
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-slate-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  ),
                },
              ]}
              data={items}
              getRowKey={(r) => r.id}
              emptyMessage="No suppliers found."
            />
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Drawer Form */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={form.id ? "Edit Supplier" : "Add New Supplier"}
        description="Enter the supplier's business details below."
        footer={
          <>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!form.name || saving}
              className="px-6 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {saving ? "Saving..." : "Save Supplier"}
            </button>
          </>
        }
      >
        <form className="flex flex-col gap-6" onSubmit={submit}>
          {/* Business Context (Read Only) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Business ID (Tenant)
            </label>
            <input
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed select-none"
              value={tenantId}
              disabled
              readOnly
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Core Info */}
          <div>
            <label className="form-label">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              className="input w-full"
              placeholder="e.g. Acme Corp"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Tax / VAT Number</label>
            <input
              className="input w-full"
              placeholder="e.g. 1234567890"
              value={form.taxNumber || ""}
              onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
            />
          </div>

          {/* 2-Column Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Contact Name</label>
              <input
                className="input w-full"
                placeholder="John Doe"
                value={form.contactName || ""}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="john@example.com"
                value={form.contactEmail || ""}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input
              className="input w-full"
              placeholder="+1 (555) 000-0000"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="form-label">Address</label>
            <textarea
              className="input w-full min-h-[80px]"
              placeholder="Enter full billing address..."
              value={form.address || ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Internal Notes</label>
            <textarea
              className="input w-full min-h-[80px]"
              placeholder="Payment terms, account manager details, etc."
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};
