import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../utils/format";
import { invoiceService } from "../../services/invoiceService";
import { partnerService } from "../../services/partnerService";
import { InvoiceType } from "../../types/invoices";

interface InvoiceItemRow {
  id: number;
  productOrServiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<InvoiceType>("sales");
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    supplierId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    invoiceNumber: "",
    currency: "TRY",
    notes: ""
  });

  const [rows, setRows] = useState<InvoiceItemRow[]>([
    { 
      id: 1, 
      productOrServiceId: "", 
      description: "Website Redesign - Phase 1", 
      quantity: 1, 
      unitPrice: 1200.0, 
      vatRate: 20 
    },
    { 
      id: 2, 
      productOrServiceId: "", 
      description: "", 
      quantity: 0, 
      unitPrice: 0.0, 
      vatRate: 20 
    },
  ]);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const [custRes, suppRes] = await Promise.all([
          partnerService.listCustomers({ page: 1, pageSize: 100 }),
          partnerService.listSuppliers({ page: 1, pageSize: 100 })
        ]);
        setCustomers(custRes.items);
        setSuppliers(suppRes.items);
      } catch (err) {
        console.error("Failed to load partners", err);
      }
    };
    void loadPartners();
  }, []);

  const addRow = () => {
    setRows([
      ...rows, 
      { 
        id: Date.now(), 
        productOrServiceId: "", 
        description: "", 
        quantity: 0, 
        unitPrice: 0.0, 
        vatRate: 20 
      }
    ]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: keyof InvoiceItemRow, value: any) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const calculateRowSubtotal = (row: InvoiceItemRow) => row.quantity * row.unitPrice;
  const calculateRowVat = (row: InvoiceItemRow) => 
    (row.quantity * row.unitPrice * row.vatRate) / 100;
  const calculateRowTotal = (row: InvoiceItemRow) => 
    calculateRowSubtotal(row) + calculateRowVat(row);

  const subtotal = rows.reduce((sum, r) => sum + calculateRowSubtotal(r), 0);
  const totalVat = rows.reduce((sum, r) => sum + calculateRowVat(r), 0);
  const total = subtotal + totalVat;

  const handleSubmit = async (isDraft: boolean) => {
    if (!form.invoiceNumber || !form.issueDate || !form.dueDate) {
      alert("Please fill all required fields");
      return;
    }

    if (type === "sales" && !form.customerId) {
      alert("Please select a customer for sales invoice");
      return;
    }

    if (type === "purchase" && !form.supplierId) {
      alert("Please select a supplier for purchase invoice");
      return;
    }

    setLoading(true);
    try {
      const invoice = await invoiceService.create({
        type,
        currency: form.currency,
        customerId: type === "sales" ? form.customerId : undefined,
        supplierId: type === "purchase" ? form.supplierId : undefined,
        issueDate: form.issueDate,
        dueDate: form.dueDate,
        invoiceNumber: form.invoiceNumber,
        notes: form.notes
      });

      // Create invoice items
      for (const row of rows.filter(r => r.description && r.quantity > 0)) {
        await invoiceService.createItem({
          invoiceId: invoice.id,
          productOrServiceId: row.productOrServiceId || "00000000-0000-0000-0000-000000000000",
          description: row.description,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
          vatRate: row.vatRate
        });
      }

      alert(isDraft ? "Invoice saved as draft" : "Invoice created successfully");
      navigate("/invoices");
    } catch (err: any) {
      alert("Failed to create invoice: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm px-1">
        <span className="text-[#4c739a] dark:text-slate-400 font-medium">Invoices</span>
        <span className="text-[#4c739a] dark:text-slate-500">/</span>
        <span className="text-[#0d141b] dark:text-slate-100 font-semibold">
          Create New Invoice
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                type === "sales"
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => setType("sales")}
            >
              Sales Invoice
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                type === "purchase"
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => setType("purchase")}
            >
              Purchase Invoice
            </button>
          </div>
          <h1 className="text-[#0d141b] dark:text-white text-4xl font-black tracking-tight">
            New {type === "sales" ? "Sales" : "Purchase"} Invoice
          </h1>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Draft
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-8">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {type === "sales" ? "Customer" : "Supplier"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={type === "sales" ? form.customerId : form.supplierId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      [type === "sales" ? "customerId" : "supplierId"]: e.target.value
                    }))
                  }
                  required
                >
                  <option value="">Select a {type === "sales" ? "customer" : "supplier"}</option>
                  {(type === "sales" ? customers : suppliers).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="e.g. INV-001"
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                  required
                >
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/2">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-20">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-28">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-24">
                      VAT %
                    </th>
                    <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-32">
                      Total
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="py-4">
                        <input
                          className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 placeholder-slate-400"
                          placeholder={row.id === 2 ? "Add new item..." : "Item description..."}
                          type="text"
                          value={row.description}
                          onChange={(e) => updateRow(row.id, "description", e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          className="w-16 bg-transparent border-none p-0 text-sm text-center focus:ring-0 placeholder-slate-400"
                          type="number"
                          value={row.quantity || ""}
                          placeholder="0"
                          onChange={(e) => updateRow(row.id, "quantity", Number(e.target.value))}
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <input
                          className="w-24 bg-transparent border-none p-0 text-sm text-right focus:ring-0 placeholder-slate-400"
                          type="number"
                          step="0.01"
                          value={row.unitPrice || ""}
                          placeholder="0.00"
                          onChange={(e) => updateRow(row.id, "unitPrice", Number(e.target.value))}
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <input
                          className="w-16 bg-transparent border-none p-0 text-sm text-right focus:ring-0 placeholder-slate-400"
                          type="number"
                          value={row.vatRate || ""}
                          placeholder="20"
                          onChange={(e) => updateRow(row.id, "vatRate", Number(e.target.value))}
                        />
                      </td>
                      <td className={`py-4 text-right text-sm font-bold ${calculateRowTotal(row) === 0 ? "text-slate-300" : ""}`}>
                        {formatMoney(calculateRowTotal(row))}
                      </td>
                      <td className="text-right">
                        {rows.length > 1 && (
                          <button 
                            onClick={() => removeRow(row.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button 
              onClick={addRow}
              className="mt-4 flex items-center gap-2 text-primary text-sm font-bold hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Add Another Item
            </button>
          </div>

          {/* Footer (Notes & Totals) */}
          <div className="flex flex-col md:flex-row justify-between pt-8 border-t border-slate-100 dark:border-slate-800 gap-8">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Internal Notes
              </label>
              <textarea
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Add any notes for yourself or your team..."
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              ></textarea>
            </div>
            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Subtotal</span>
                <span className="font-bold">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">VAT</span>
                <span className="font-bold">{formatMoney(totalVat)}</span>
              </div>
              <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-black tracking-tight">Total Amount</span>
                <span className="text-2xl font-black text-primary">
                  {formatMoney(total)} {form.currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/30 px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-sm transition-colors">
            <span className="material-symbols-outlined">attachment</span>
            Attach Files
          </button>
          <div className="flex items-center gap-3">
            <button 
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>
            <button 
              className="bg-primary text-white px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50"
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              {loading ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom security note */}
      <div className="flex justify-center pb-4">
        <p className="text-slate-400 dark:text-slate-500 text-xs text-center flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">lock</span>
          All transactions are encrypted and secure
        </p>
      </div>
    </div>
  );
};
