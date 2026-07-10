import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Stats = {
  suppliers: number;
  invoices: number;
  totalSales: number;
  purchases: number;
};

function readArray<T>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function getStats(): Stats {
  const suppliers = readArray<unknown>("suppliers");
  const invoices = readArray<{ grandTotal?: number }>("invoices");
  const purchases = readArray<unknown>("inventory-purchases");

  const totalSales = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

  return {
    suppliers: suppliers.length,
    invoices: invoices.length,
    totalSales,
    purchases: purchases.length,
  };
}

const MODULES = [
  {
    to: "/suppliers",
    title: "Suppliers",
    text: "Manage vendors, payments, ledger and outstanding balances.",
    icon: "fa-solid fa-truck-field",
  },
  {
    to: "/inventory",
    title: "Inventory",
    text: "Products, stock in/out, categories and low-stock alerts.",
    icon: "fa-solid fa-boxes-stacked",
  },
  {
    to: "/invoice",
    title: "Invoice",
    text: "Create GST invoices, print, export PDF and track history.",
    icon: "fa-solid fa-file-invoice",
  },
  {
    to: "/purchase",
    title: "Purchase",
    text: "Purchase billing, GST, returns and stock updates.",
    icon: "fa-solid fa-cart-shopping",
  },
];

function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>(() => getStats());

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <div className="container-fluid px-0">
      <h2 className="mb-1">Dashboard</h2>
      <p className="text-muted mb-4">Welcome to your Billing Software workspace.</p>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="text-muted mb-1">Total Sales</h6>
            <h3 className="mb-0">₹{stats.totalSales.toLocaleString("en-IN")}</h3>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="text-muted mb-1">Invoices</h6>
            <h3 className="mb-0">{stats.invoices}</h3>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="text-muted mb-1">Suppliers</h6>
            <h3 className="mb-0">{stats.suppliers}</h3>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="text-muted mb-1">Purchase Bills</h6>
            <h3 className="mb-0">{stats.purchases}</h3>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {MODULES.map((module) => (
          <div className="col-md-6 col-lg-3" key={module.to}>
            <div
              className="card shadow-sm border-0 p-4 h-100"
              role="button"
              onClick={() => navigate(module.to)}
            >
              <div className="mb-3 fs-2 text-primary">
                <i className={module.icon}></i>
              </div>
              <h5>{module.title}</h5>
              <p className="text-muted mb-0">{module.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Overview;
