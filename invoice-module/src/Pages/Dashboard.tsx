import { useEffect, useState } from "react";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

interface DashboardStats {
  totalSales: number;
  customers: number;
  invoices: number;
  products: number;
}

interface StoredInvoice {
  customerName?: string;
  grandTotal?: number;
  product?: string;
}

const getDashboardStats = (): DashboardStats => {
  if (typeof window === "undefined") {
    return { totalSales: 0, customers: 0, invoices: 0, products: 0 };
  }

  const invoices: StoredInvoice[] = JSON.parse(
    localStorage.getItem("invoices") || "[]"
  );
  const customers = JSON.parse(localStorage.getItem("customers") || "[]") as {
    customerName?: string;
  }[];

  const uniqueCustomers = new Set<string>();
  invoices.forEach((invoice) => {
    if (invoice.customerName?.trim()) {
      uniqueCustomers.add(invoice.customerName.trim().toLowerCase());
    }
  });
  customers.forEach((customer) => {
    if (customer.customerName?.trim()) {
      uniqueCustomers.add(customer.customerName.trim().toLowerCase());
    }
  });

  const uniqueProducts = new Set<string>();
  invoices.forEach((invoice) => {
    if (invoice.product?.trim()) {
      uniqueProducts.add(invoice.product.trim().toLowerCase());
    }
  });

  const totalSales = invoices.reduce(
    (sum, invoice) => sum + (invoice.grandTotal || 0),
    0
  );

  return {
    totalSales,
    customers: uniqueCustomers.size,
    invoices: invoices.length,
    products: uniqueProducts.size || 4,
  };
};

function Dashboard({ setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  const [stats, setStats] = useState<DashboardStats>(() => getDashboardStats());

  useEffect(() => {
    const syncStats = () => setStats(getDashboardStats());

    syncStats();
    const interval = window.setInterval(syncStats, 1000);
    window.addEventListener("storage", syncStats);
    window.addEventListener("focus", syncStats);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", syncStats);
      window.removeEventListener("focus", syncStats);
    };
  }, []);

  return (
    <>
      <h2>Invoice Management System</h2>

      <button onClick={() => setCurrentPage("create-invoice")} className="btn btn-primary mt-3">
        Create Invoice
      </button>

      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card shadow p-3">
            <h6>Total Sales</h6>
            <h3>₹{stats.totalSales.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3">
            <h6>Customers</h6>
            <h3>{stats.customers}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3">
            <h6>Invoices</h6>
            <h3>{stats.invoices}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3">
            <h6>Products</h6>
            <h3>{stats.products}</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;