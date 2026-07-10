import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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

function App() {
  const [products, setProducts] = useState([
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
  ]);
  const [stockInRecords, setStockInRecords] = useState([]);
  const [stockOutRecords, setStockOutRecords] = useState([]);

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
        p.productCode === productCode
          ? { ...p, stock: p.stock + quantity }
          : p
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
        p.productCode === productCode
          ? { ...p, stock: p.stock - quantity }
          : p
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
        product.productCode === updatedProduct.productCode
          ? updatedProduct
          : product
      )
    );
  };

  const deleteProduct = (productCode) => {
    setProducts((prev) =>
      prev.filter((product) => product.productCode !== productCode)
    );
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <h2>Inventory App</h2>
          <nav>
            <ul>
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/add">Add Product</Link>
              </li>
              <li>
                <Link to="/products">Product List</Link>
              </li>
              <li>
                <Link to="/category">Category</Link>
              </li>
              <li>
                <Link to="/stockin">Stock In</Link>
              </li>
              <li>
                <Link to="/stockout">Stock Out</Link>
              </li>
              <li>
                <Link to="/lowstock">Low Stock</Link>
              </li>
              <li>
                <Link to="/reports">Reports</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddProduct onSave={addProduct} />} />
              <Route
                path="/products"
                element={<ProductList products={products} onDelete={deleteProduct} />}
              />
              <Route
                path="/edit/:productCode"
                element={
                  <EditProduct products={products} onUpdate={updateProduct} />
                }
              />
              <Route
                path="/delete"
                element={
                  <DeleteProduct products={products} onDelete={deleteProduct} />
                }
              />
              <Route path="/category" element={<Category />} />
              <Route
                path="/stockin"
                element={
                  <StockIn products={products} onSave={addStockIn} stockInRecords={stockInRecords} />
                }
              />
              <Route
                path="/stockout"
                element={
                  <StockOut products={products} onSave={addStockOut} stockOutRecords={stockOutRecords} />
                }
              />
              <Route
                path="/lowstock"
                element={<LowStockAlert products={products} />}
              />
              <Route
                path="/reports"
                element={
                  <Reports
                    products={products}
                    stockInRecords={stockInRecords}
                    stockOutRecords={stockOutRecords}
                  />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;