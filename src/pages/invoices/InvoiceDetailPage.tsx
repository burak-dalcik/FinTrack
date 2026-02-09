import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoiceService } from "../../services/invoiceService";
import { Invoice, InvoiceItem } from "../../types/invoices";
import { formatMoney, formatDate } from "../../utils/format";
import { partnerService } from "../../services/partnerService";

export const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const inv = await invoiceService.get(id);
        setInvoice(inv);
        
        // Load items
        const itemsRes = await invoiceService.listItems({ invoiceId: id, pageSize: 100 });
        setItems(itemsRes.items);

        // Load partner name
        if (inv.type === "sales" && inv.customerId) {
           // We'd need getCustomer here, assuming partnerService has it or we use list
           // For now, let's just try to fetch if we have the method, otherwise skip
        } else if (inv.type === "purchase" && inv.supplierId) {
           try {
             const supplier = await partnerService.getSupplier(inv.supplierId);
             setPartnerName(supplier.name);
           } catch { /* ignore */ }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/invoices")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">Invoice #{invoice.invoiceNumber}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                invoice.status === 'overdue' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                'bg-amber-100 text-amber-700 border-amber-200'
              }`}>
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {invoice.type === 'sales' ? 'Customer' : 'Supplier'}: {partnerName || 'Unknown'} • Issued {formatDate(invoice.issueDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="text-sm font-medium">Download</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-all shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            <span className="text-sm font-medium">Upload New Version</span>
          </button>
        </div>
      </header>

      {/* Main Content Area (Split Screen) */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Document Viewer */}
        <section className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col relative border-r border-slate-200 dark:border-slate-800">
          {/* Viewer Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-xl border border-white/20 z-20">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><span className="material-symbols-outlined text-[18px]">zoom_out</span></button>
            <span className="px-3 text-xs font-semibold border-x border-slate-200 dark:border-slate-700">100%</span>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><span className="material-symbols-outlined text-[18px]">zoom_in</span></button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><span className="material-symbols-outlined text-[18px]">rotate_right</span></button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><span className="material-symbols-outlined text-[18px]">fullscreen</span></button>
          </div>

          {/* Document Display Area */}
          <div className="flex-1 overflow-auto p-12 flex justify-center custom-scrollbar" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <div className="max-w-3xl w-full bg-white shadow-2xl rounded-sm p-12 min-h-[1000px] relative flex items-center justify-center">
              {/* Placeholder for actual document */}
              <div className="text-center text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4">description</span>
                <p>No document uploaded</p>
                <button className="mt-4 px-4 py-2 border border-dashed border-slate-300 rounded-lg hover:border-primary hover:text-primary transition-colors">
                  Upload PDF or Image
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Data Editor */}
        <aside className="w-[450px] bg-white dark:bg-slate-900 flex flex-col shrink-0 border-l border-slate-200 dark:border-slate-800">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Header Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    {invoice.type === 'sales' ? 'Customer' : 'Supplier'} Name
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" 
                      type="text" 
                      value={partnerName}
                      readOnly
                    />
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-emerald-500 text-[18px]">verified</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Invoice #</label>
                    <input 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" 
                      type="text" 
                      value={invoice.invoiceNumber}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Invoice Date</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" 
                        type="text" 
                        value={formatDate(invoice.issueDate)}
                        readOnly
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">calendar_today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Line Items</h3>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="text-sm font-medium mb-2">{item.description || 'Item'}</div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase">Qty</label>
                        <div className="text-sm">{item.quantity}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase">Price</label>
                        <div className="text-sm">{formatMoney(item.unitPrice)}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase">VAT %</label>
                        <div className="text-sm">{item.vatRate}%</div>
                      </div>
                      <div className="text-right">
                        <label className="block text-[10px] text-slate-400 uppercase">Total</label>
                        <span className="text-sm font-semibold">{formatMoney(item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
              <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                <span className="text-sm font-bold text-primary">Grand Total</span>
                <span className="text-xl font-bold text-primary">{formatMoney(invoice.totalAmount)} {invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3 shrink-0">
            <button className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              Approve for Accounting
            </button>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm">
                Save Draft
              </button>
              <button className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <span className="material-symbols-outlined text-[20px]">delete_outline</span>
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
