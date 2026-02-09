import { useAuth } from "../../context/AuthContext";
import { getBusinessCodename } from "../../services/apiClient";

export const Topbar = () => {
  const { user, logout } = useAuth();
  const businessName = getBusinessCodename();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500">My Business:</span>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 transition-colors">
          <span className="capitalize">{businessName}</span>
          <span className="material-symbols-outlined text-sm">unfold_more</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <div className="relative group">
               <div 
                 className="h-10 w-10 rounded-full bg-slate-200 border-2 border-primary/20 flex items-center justify-center text-primary font-bold cursor-pointer"
               >
                  {user.name.charAt(0).toUpperCase()}
               </div>
               {/* Simple dropdown for logout */}
               <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Logout
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
