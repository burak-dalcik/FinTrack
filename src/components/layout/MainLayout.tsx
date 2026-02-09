import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-200">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar />
        <div className="p-8 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </div>
        <footer className="mt-auto p-8 text-center text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
          © 2026 FinTrack Financial Tools. All rights reserved.
        </footer>
      </main>
    </div>
  );
};
