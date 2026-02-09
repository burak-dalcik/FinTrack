import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { EmailVerificationPage } from "./pages/auth/EmailVerificationPage";
import { MobileVerificationPage } from "./pages/auth/MobileVerificationPage";
import { PasswordResetPage } from "./pages/auth/PasswordResetPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { InvoicesPage } from "./pages/invoices/InvoicesPage";
import { CreateInvoicePage } from "./pages/invoices/CreateInvoicePage";
import { SuppliersPage } from "./pages/suppliers/SuppliersPage";
import { CustomersPage } from "./pages/customers/CustomersPage";
import { PaymentsPage } from "./pages/payments/PaymentsPage";
import { ExpensesPage } from "./pages/expenses/ExpensesPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { UserManagementPage } from "./pages/users/UserManagementPage";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { Role } from "./types/auth";

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/verify-mobile" element={<MobileVerificationPage />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="invoices">
          <Route index element={<InvoicesPage />} />
          <Route path="create" element={<CreateInvoicePage />} />
        </Route>
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={[Role.Owner, Role.Accountant]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={[Role.Owner]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
