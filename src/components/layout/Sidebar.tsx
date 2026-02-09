import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Role } from "../../types/auth";

export const Sidebar = () => {
  const { user, hasRole } = useAuth();

  if (!user) return null;

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
    }`;

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col fixed inset-y-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <span className="material-symbols-outlined block">account_balance_wallet</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-[#0d141b] dark:text-white">
            FinTrack
          </h2>
        </div>
        <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
          Pre-accounting
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto sidebar-scroll">
        <NavLink to="/" end className={getLinkClass}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm font-semibold">Dashboard</span>
        </NavLink>
        <NavLink to="/invoices" className={getLinkClass}>
          <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          <span className="text-sm font-medium">Invoices</span>
        </NavLink>
        <NavLink to="/customers" className={getLinkClass}>
          <span className="material-symbols-outlined text-[20px]">group</span>
          <span className="text-sm font-medium">Customers</span>
        </NavLink>
        <NavLink to="/suppliers" className={getLinkClass}>
          <span className="material-symbols-outlined text-[20px]">factory</span>
          <span className="text-sm font-medium">Suppliers</span>
        </NavLink>
        <NavLink to="/payments" className={getLinkClass}>
          <span className="material-symbols-outlined text-[20px]">credit_card</span>
          <span className="text-sm font-medium">Payments</span>
        </NavLink>
        <NavLink to="/expenses" className={getLinkClass}>
          <span className="material-symbols-outlined text-[20px]">payments</span>
          <span className="text-sm font-medium">Expenses</span>
        </NavLink>
        {hasRole([Role.Owner, Role.Accountant]) && (
          <NavLink to="/reports" className={getLinkClass}>
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            <span className="text-sm font-medium">Reports</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        {hasRole(Role.Owner) && (
          <NavLink to="/users" className={getLinkClass}>
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span className="text-sm font-medium">Users</span>
          </NavLink>
        )}
        {/* Settings link placeholder */}
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </a>
      </div>
    </aside>
  );
};
