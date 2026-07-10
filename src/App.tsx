import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./modules/auth/Home";
import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";
import ForgotPassword from "./modules/auth/ForgotPassword";
import UpdatePassword from "./modules/auth/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/Overview";

// In-app modules are code-split so each is loaded on demand and the initial
// bundle stays small (jsPDF, for example, only loads with the invoice module).
const PurchaseManager = lazy(() => import("./modules/purchase/PurchaseManager"));
const InventoryModule = lazy(() => import("./modules/inventory/InventoryModule"));
const InvoiceModule = lazy(() => import("./modules/invoice/InvoiceModule"));
const SuppliersModule = lazy(() => import("./modules/suppliers/SuppliersModule"));

function ModuleFallback() {
  return <div className="text-center text-muted py-5">Loading…</div>;
}

function PurchasePage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };
  return <PurchaseManager onLogout={handleLogout} />;
}

function App() {
  return (
    <Routes>
      {/* Public / auth routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* Protected in-app modules share the dashboard shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Overview />} />
        <Route
          path="/suppliers"
          element={
            <Suspense fallback={<ModuleFallback />}>
              <SuppliersModule />
            </Suspense>
          }
        />
        <Route
          path="/inventory"
          element={
            <Suspense fallback={<ModuleFallback />}>
              <InventoryModule />
            </Suspense>
          }
        />
        <Route
          path="/invoice"
          element={
            <Suspense fallback={<ModuleFallback />}>
              <InvoiceModule />
            </Suspense>
          }
        />
        <Route
          path="/purchase"
          element={
            <Suspense fallback={<ModuleFallback />}>
              <PurchasePage />
            </Suspense>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
