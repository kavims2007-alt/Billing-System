import { useEffect, useState } from "react";
import "./inventory.css";

import Dashboard from "./components/Dashboard";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import EditProduct from "./components/EditProduct";
import DeleteProduct from "./components/Deleteproduct";
import Category from "./components/Category";
import StockIn from "./components/StockIn";
import StockOut from "./components/StockOut";
import LowStockAlert from "./components/LowStockAlert";
import Reports from "./components/Reports";

const DEFAULT_PRODUCTS = [
  {
    productName: "Dell Laptop",
    productCode: "LAP001",
    barcode: "1234567890123",
    category: "Electronics",
    purchasePrice: 45000,
    sellingPrice: 50000,
    gst: 18,
    stock: 10,
    minStock: 5,
    unit: "Nos",
  },
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "add", label: "Add Product" },
  { key: "products", label: "Product List" },
  { key: "category", label: "Category" },
  { key: "stockin", label: "Stock In" },
  { key: "stockout", label: "Stock Out" },
  { key: "lowstock", label: "Low Stock" },
  { key: "reports", label: "Reports" },
];

function InventoryModule() {
  const [products, setProducts] = useState(() => readStorage("inventory-products", DEFAULT_PRODUCTS));
  const [stockInRecords, setStockInRecords] = useState(() => readStorage("inventory-stock-in", []));
  const [stockOutRecords, setStockOutRecords] = useState(() => readStorage("inventory-stock-out", []));
  const [page, setPage] = useState("dashboard");
  const [editingCode, setEditingCode] = useState("");

  useEffect(() => {
    localStorage.setItem("inventory-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("inventory-stock-in", JSON.stringify(stockInRecords));
  }, [stockInRecords]);

  useEffect(() => {
    localStorage.setItem("inventory-stock-out", JSON.stringify(stockOutRecords));
  }, [stockOutRecords]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const addStockIn = ({ productCode, quantity, date }) => {
    const product = products.find((p) => p.productCode === productCode);
    if (!product || quantity <= 0) {
      return false;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.productCode === productCode ? { ...p, stock: p.stock + quantity } : p
      )
    );

    setStockInRecords((prev) => [
      ...prev,
      { productCode, quantity, date, id: `${productCode}-${Date.now()}` },
    ]);

    return true;
  };

  const addStockOut = ({ productCode, quantity, date }) => {
    const product = products.find((p) => p.productCode === productCode);
    if (!product || quantity <= 0 || product.stock < quantity) {
      return false;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.productCode === productCode ? { ...p, stock: p.stock - quantity } : p
      )
    );

    setStockOutRecords((prev) => [
      ...prev,
      { productCode, quantity, date, id: `${productCode}-${Date.now()}` },
    ]);

    return true;
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.productCode === updatedProduct.productCode ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (productCode) => {
    setProducts((prev) => prev.filter((product) => product.productCode !== productCode));
  };

  const startEdit = (productCode) => {
    setEditingCode(productCode);
    setPage("edit");
  };

  const renderPage = () => {
    switch (page) {
      case "add":
        return <AddProduct onSave={addProduct} onNavigate={setPage} />;
      case "products":
        return <ProductList products={products} onDelete={deleteProduct} onEdit={startEdit} />;
      case "edit":
        return (
          <EditProduct
            products={products}
            onUpdate={updateProduct}
            productCode={editingCode}
            onDone={() => setPage("products")}
          />
        );
      case "delete":
        return <DeleteProduct products={products} onDelete={deleteProduct} onNavigate={setPage} />;
      case "category":
        return <Category />;
      case "stockin":
        return <StockIn products={products} onSave={addStockIn} stockInRecords={stockInRecords} />;
      case "stockout":
        return <StockOut products={products} onSave={addStockOut} stockOutRecords={stockOutRecords} />;
      case "lowstock":
        return <LowStockAlert products={products} />;
      case "reports":
        return (
          <Reports
            products={products}
            stockInRecords={stockInRecords}
            stockOutRecords={stockOutRecords}
          />
        );
      case "dashboard":
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <>
      <div className="module-subnav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={page === tab.key || (page === "edit" && tab.key === "products") ? "active" : ""}
            onClick={() => setPage(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="inventory-module">
        <div className="page-content">{renderPage()}</div>
      </div>
    </>
  );
}

export default InventoryModule;
