import { useEffect, useState } from "react";
import { formatMoney } from "../../utils/format";
import { reportService, BalanceRow } from "../../services/reportService";

export const ReportsPage = () => {
  const [fromDate, setFromDate] = useState(
    () => new Date(new Date().setDate(1)).toISOString().slice(0, 10)
  );
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rangePreset, setRangePreset] = useState<"30days" | "year" | "quarter" | "custom">(
    "30days"
  );

  const [income, setIncome] = useState<number | null>(null);
  const [expense, setExpense] = useState<number | null>(null);
  const [customerRows, setCustomerRows] = useState<BalanceRow[]>([]);
  const [supplierRows, setSupplierRows] = useState<BalanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const applyPreset = (preset: typeof rangePreset) => {
    const now = new Date();
    let start = new Date(fromDate);

    if (preset === "30days") {
      start = new Date(now);
      start.setDate(now.getDate() - 30);
    } else if (preset === "year") {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (preset === "quarter") {
      const currentMonth = now.getMonth();
      const quarterStartMonth = currentMonth - (currentMonth % 3);
      start = new Date(now.getFullYear(), quarterStartMonth, 1);
    }

    setRangePreset(preset);
    if (preset !== "custom") {
      setFromDate(start.toISOString().slice(0, 10));
      setToDate(now.toISOString().slice(0, 10));
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const [ie, cust, supp] = await Promise.all([
        reportService.incomeExpense(fromDate, toDate),
        reportService.customerBalances(fromDate, toDate),
        reportService.supplierBalances(fromDate, toDate)
      ]);
      setIncome(ie.totalIncome);
      setExpense(ie.totalExpense);
      setCustomerRows(cust.rows);
      setSupplierRows(supp.rows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const net = income != null && expense != null ? income - expense : null;
  const taxEstimate = income && expense ? Math.max(net ?? 0, 0) * 0.15 : null;

  const incomePct = income && income > 0 ? 100 : null;
  const expensePct = income && income > 0 && expense != null ? (expense / income) * 100 : null;
  const marginPct =
    income && income > 0 && net != null ? ((net / income) * 100).toFixed(1) : undefined;

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em]">
            Financial Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Deep dive into your business health and profitability.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span>Schedule</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-xs md:text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
            onClick={load}
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Date range presets */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          {(["30days", "year", "quarter", "custom"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`px-4 md:px-6 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                rangePreset === preset
                  ? "bg-primary text-slate-900"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {preset === "30days"
                ? "Last 30 Days"
                : preset === "year"
                ? "This Year"
                : preset === "quarter"
                ? "Last Quarter"
                : "Custom Range"}
            </button>
          ))}
        </div>

        {/* Exact date inputs */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            className="input min-w-[140px]"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setRangePreset("custom");
            }}
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="date"
            className="input min-w-[140px]"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setRangePreset("custom");
            }}
          />
        </div>
      </div>

      {loading && (
        <div className="centered">
          <div className="spinner" />
        </div>
      )}

      {/* Summary section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net profit card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
            <span className="material-symbols-outlined text-[80px] md:text-[120px] text-primary">
              trending_up
            </span>
          </div>
          <div className="flex flex-col gap-1 relative z-10">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Net Profit (Take-home Pay)
            </p>
            <div className="flex items-baseline gap-3 mt-2">
              <h2 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-black tracking-tight">
                {net != null ? formatMoney(net) : "—"}
              </h2>
              {income && expense && (
                <div className="flex items-center gap-1 bg-primary/20 text-slate-900 dark:text-primary px-2 py-1 rounded text-xs md:text-sm font-bold">
                  <span className="material-symbols-outlined text-xs">arrow_upward</span>
                  <span>{marginPct ? `${marginPct}% margin` : "—"}</span>
                </div>
              )}
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-3">
              Period: {fromDate} → {toDate}
            </p>
          </div>
          <div className="mt-6 md:mt-8 flex flex-wrap gap-6 relative z-10 text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Gross Income
              </span>
              <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {income != null ? formatMoney(income) : "—"}
              </span>
            </div>
            <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-6">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Total Expenses
              </span>
              <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {expense != null ? formatMoney(expense) : "—"}
              </span>
            </div>
            <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-6">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Tax Estimated
              </span>
              <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {taxEstimate != null ? formatMoney(taxEstimate) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Financial health card (mocked) */}
        <div className="bg-primary/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-primary/20">
          <div>
            <h3 className="text-slate-900 dark:text-primary text-lg md:text-xl font-black">
              Financial Health
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mt-2">
              Your business is performing above the healthy margin threshold for this period.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{ width: `${Math.min(Number(marginPct) || 0, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>NET MARGIN</span>
              <span className="text-slate-900 dark:text-white">
                {marginPct ? `${marginPct}%` : "—"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-full py-2.5 mt-4 bg-slate-900 text-white dark:bg-primary dark:text-slate-900 rounded-xl font-bold text-xs md:text-sm"
          >
            Get AI Insights
          </button>
        </div>
      </div>

      {/* Profit & loss summary + balances */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* P&L table */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">
                Profit &amp; Loss Summary
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Simple breakdown of your money coming in and out.
              </p>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest">
              Simplified View
            </span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Financial Area
                </th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Amount
                </th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Money Earned (Gross Revenue)
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Total sales from all income sources.
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-sm text-slate-900 dark:text-white">
                  {income != null ? formatMoney(income) : "—"}
                </td>
                <td className="px-6 py-4 text-right font-medium text-sm text-slate-500">
                  {incomePct != null ? `${incomePct.toFixed(0)}%` : "—"}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">remove_circle</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Total Expenses (Money Out)
                      </p>
                      <p className="text-[10px] text-slate-400">
                        All operating costs, purchases and overhead.
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-sm text-slate-900 dark:text-white">
                  {expense != null ? formatMoney(expense) : "—"}
                </td>
                <td className="px-6 py-4 text-right font-medium text-sm text-slate-500">
                  {expensePct != null ? `${expensePct.toFixed(1)}%` : "—"}
                </td>
              </tr>
              <tr className="bg-primary/5">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary text-slate-900 flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">savings</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        What's Left (Net Margin)
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Your actual profitability after all expenses.
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-black text-base md:text-lg text-slate-900 dark:text-white">
                  {net != null ? formatMoney(net) : "—"}
                </td>
                <td className="px-6 py-5 text-right font-bold text-sm text-primary">
                  {marginPct ? `${marginPct}%` : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Customer & supplier balances (stacked) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Customer Balances
              </h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="px-4 py-2 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {customerRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-3 text-center text-[11px] text-slate-500"
                      >
                        No data.
                      </td>
                    </tr>
                  ) : (
                    customerRows.map((r) => (
                      <tr key={r.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-2">{r.name}</td>
                        <td className="px-4 py-2 text-right">{formatMoney(r.balance)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Supplier Balances
              </h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Supplier
                    </th>
                    <th className="px-4 py-2 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {supplierRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-3 text-center text-[11px] text-slate-500"
                      >
                        No data.
                      </td>
                    </tr>
                  ) : (
                    supplierRows.map((r) => (
                      <tr key={r.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-2">{r.name}</td>
                        <td className="px-4 py-2 text-right">{formatMoney(r.balance)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Help note */}
      <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-blue-50 dark:bg-slate-800/50 rounded-xl border border-blue-100 dark:border-slate-700 text-xs md:text-sm">
        <span className="material-symbols-outlined text-blue-500 text-base md:text-lg">info</span>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-slate-900 dark:text-slate-200">
            How to read this report
          </p>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            The net profit figure is the most important—it's the actual money your business
            generated after paying all bills. A net margin above 20% is generally considered
            healthy for most small businesses in this category.
          </p>
        </div>
      </div>
    </div>
  );
};

