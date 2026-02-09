import { useEffect, useState, FormEvent } from "react";
import { DataTable } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { Modal } from "../../components/ui/Modal";
import { usePagination } from "../../hooks/usePagination";
import { formatDate, formatMoney } from "../../utils/format";
import { paymentService } from "../../services/paymentService";
import { Payment, PaymentDirection } from "../../types/payments";

export const PaymentsPage = () => {
  const { page, pageSize, setPage } = usePagination();
  const [items, setItems] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [methodFilter, setMethodFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [form, setForm] = useState<{
    date: string;
    amount: number;
    currency: string;
    invoiceId?: string;
    method?: string;
    notes?: string;
    payerName?: string;
    reference?: string;
  }>({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    currency: "TRY"
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await paymentService.list({
        method: methodFilter || undefined,
        date: dateFilter || undefined,
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
  }, [methodFilter, dateFilter, page, pageSize]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.currency) return;
    setSaving(true);
    try {
      await paymentService.create({
        amount: form.amount,
        currency: form.currency,
        date: form.date,
        invoiceId: form.invoiceId,
        method: form.method,
        notes: form.notes,
        payerName: form.payerName,
        reference: form.reference
      });
      setOpen(false);
      setForm({
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        currency: "TRY"
      });
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Payments</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Record Payment
        </button>
      </div>

      <div className="filters-row">
        <input
          type="text"
          className="input"
          placeholder="Filter by method (e.g. bank transfer, cash)"
          value={methodFilter}
          onChange={(e) => {
            setMethodFilter(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="input"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="centered">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <DataTable<Payment>
            columns={[
              { header: "Date", accessor: (r) => formatDate(r.date) },
              { header: "Payer/Payee", accessor: (r) => r.payerName || "—" },
              { header: "Amount", accessor: (r) => `${formatMoney(r.amount)} ${r.currency}` },
              { header: "Method", accessor: (r) => r.method || "—" },
              { header: "Reference", accessor: (r) => r.reference || "—" },
              { header: "Invoice ID", accessor: (r) => r.invoiceId || "—" }
            ]}
            data={items}
            getRowKey={(r) => r.id}
            emptyMessage="No payments recorded."
          />
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </>
      )}

      <Modal title="Record Payment" open={open} onClose={() => setOpen(false)}>
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
                className="select"
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
          <div className="filters-row">
            <label className="form-label">
              Payer/Payee Name (Optional)
              <input
                className="input"
                value={form.payerName ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, payerName: e.target.value }))}
                placeholder="e.g. Customer name or vendor"
              />
            </label>
            <label className="form-label">
              Payment Method (Optional)
              <input
                className="input"
                value={form.method ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
                placeholder="e.g. bank transfer, cash, card"
              />
            </label>
          </div>
          <label className="form-label">
            Reference (Optional)
            <input
              className="input"
              value={form.reference ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
              placeholder="Transaction ID or reference number"
            />
          </label>
          <label className="form-label">
            Invoice ID (Optional)
            <input
              className="input"
              value={form.invoiceId ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, invoiceId: e.target.value }))}
              placeholder="Link to invoice if applicable"
            />
          </label>
          <label className="form-label">
            Internal Notes (Optional)
            <textarea
              className="input"
              rows={3}
              value={form.notes ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Internal comments or clarifications"
            />
          </label>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!form.amount || !form.currency || saving}
          >
            {saving ? "Saving..." : "Save Payment"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

