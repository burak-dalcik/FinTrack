import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DataTable } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { formatDate, formatMoney } from "../../utils/format";
import { invoiceService } from "../../services/invoiceService";
import { Invoice, InvoiceStatus, InvoiceType } from "../../types/invoices";

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
        issueDate: fromDate || undefined,
        dueDate: toDate || undefined,
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

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Invoices</h2>
        <Link to="/invoices/create" className="btn btn-primary">
          New Invoice
        </Link>
      </div>

      <div className="filters-row" style={{ marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            className="btn btn-secondary"
            style={tab === "sales" ? { background: "#16a34a" } : undefined}
            onClick={() => handleTabChange("sales")}
          >
            Sales
          </button>
          <button
            className="btn btn-secondary"
            style={tab === "purchase" ? { background: "#16a34a" } : undefined}
            onClick={() => handleTabChange("purchase")}
          >
            Purchase
          </button>
        </div>

        <select
          className="select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="ALL">All statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partially Paid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>

        <input
          type="date"
          className="input"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="centered">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <DataTable<Invoice>
            columns={[
              { header: "Issue Date", accessor: (row) => formatDate(row.issueDate) },
              { header: "Due Date", accessor: (row) => formatDate(row.dueDate) },
              { header: "Invoice No", accessor: "invoiceNumber" },
              { 
                header: tab === "sales" ? "Customer" : "Supplier", 
                accessor: (row) => row.customerId || row.supplierId || "—" 
              },
              { 
                header: "Total", 
                accessor: (row) => `${formatMoney(row.totalAmount)} ${row.currency}` 
              },
              {
                header: "Status",
                accessor: (row) => (
                  <span className={statusBadgeClass(row.status)}>{row.status}</span>
                )
              }
            ]}
            data={items}
            getRowKey={(r) => r.id}
            emptyMessage="No invoices found for this filter."
          />
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};
