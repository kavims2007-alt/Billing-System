import Products from "./Pages/Products";
import Customers from "./Pages/Customers";
import { useState } from "react";
import Dashboard from "./Pages/Dashboard";
import CreateInvoice from "./Pages/CreateInvoice";
import InvoiceHistory from "./Pages/InvoiceHistory";
import Settings from "./Pages/Settings";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
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
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 bg-dark text-white vh-100 p-3">
          <h3>InvoicePro</h3>
          <hr />

          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`btn btn-link text-white text-decoration-none d-block mb-2 text-start ${currentPage === "dashboard" ? "fw-bold" : ""}`}
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage("create-invoice")}
            className={`btn btn-link text-white text-decoration-none d-block mb-2 text-start ${currentPage === "create-invoice" ? "fw-bold" : ""}`}
          >
            📄 Create Invoice
          </button>
          <button
            onClick={() => setCurrentPage("invoice-history")}
            className={`btn btn-link text-white text-decoration-none d-block mb-2 text-start ${currentPage === "invoice-history" ? "fw-bold" : ""}`}
          >
            📜 Invoice History
          </button>
          <button
            onClick={() => setCurrentPage("customers")}
            className={`btn btn-link text-white text-decoration-none d-block mb-2 text-start ${currentPage === "customers" ? "fw-bold" : ""}`}
          >
            👥 Customers
          </button>
          <button
            onClick={() => setCurrentPage("products")}
            className={`btn btn-link text-white text-decoration-none d-block mb-2 text-start ${currentPage === "products" ? "fw-bold" : ""}`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setCurrentPage("settings")}
            className={`btn btn-link text-white text-decoration-none d-block mb-2 text-start ${currentPage === "settings" ? "fw-bold" : ""}`}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="col-10 p-4">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;