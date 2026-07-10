import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct({ onSave }) {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [gst, setGst] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [unit, setUnit] = useState("");
  const navigate = useNavigate();

  const saveProduct = () => {
    if (!productName || !productCode) {
      alert("Please fill in the product name and product code.");
      return;
    }

    const newProduct = {
      productName,
      productCode,
      barcode,
      category,
      purchasePrice: Number(purchasePrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      gst: Number(gst) || 0,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      unit,
    };

    onSave(newProduct);
    alert("Product saved successfully!");
    navigate("/products");
  };

  return (
    <div className="form-container" style={{ padding: "20px" }}>
      <h1>Add Product</h1>

      <div className="form-row">
        <div className="form-col">
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Product Code</label>
          <input
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Barcode</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <label>Purchase Price</label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Selling Price</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>GST %</label>
          <input
            type="number"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Stock Quantity</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <label>Minimum Stock</label>
          <input
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
      </div>

      <button onClick={saveProduct} style={{ marginTop: "16px" }}>Save Product</button>
    </div>
  );
}

export default AddProduct;