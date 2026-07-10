import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceHistory from "./pages/InvoiceHistory";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

type PageType =
  | "dashboard"
  | "create-invoice"
  | "invoice-history"
  | "customers"
  | "products"
  | "settings";

const TABS: { key: PageType; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "create-invoice", label: "Create Invoice" },
  { key: "invoice-history", label: "Invoice History" },
  { key: "customers", label: "Customers" },
  { key: "products", label: "Products" },
  { key: "settings", label: "Settings" },
];

function InvoiceModule() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "create-invoice":
        return <CreateInvoice setCurrentPage={setCurrentPage} />;
      case "invoice-history":
        return <InvoiceHistory setCurrentPage={setCurrentPage} />;
      case "customers":
        return <Customers setCurrentPage={setCurrentPage} />;
      case "products":
        return <Products setCurrentPage={setCurrentPage} />;
      case "settings":
        return <Settings setCurrentPage={setCurrentPage} />;
      case "dashboard":
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="invoice-module">
      <div className="module-subnav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={currentPage === tab.key ? "active" : ""}
            onClick={() => setCurrentPage(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderPage()}
    </div>
  );
}

export default InvoiceModule;
