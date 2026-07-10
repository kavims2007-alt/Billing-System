import { useState } from "react";

function StockOut({ products, onSave, stockOutRecords }) {
  const [productCode, setProductCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const matchingProduct =
    products.find((p) => p.productCode === productCode) ||
    products.find((p) => p.barcode === barcode);

  const saveStockOut = () => {
    if (!matchingProduct || Number(quantity) <= 0) {
      alert("Please select a valid product and enter a positive quantity.");
      return;
    }

    const success = onSave({
      productCode: matchingProduct.productCode,
      quantity: Number(quantity),
      date,
    });

    if (success) {
      alert("Stock out recorded successfully.");
      setProductCode("");
      setBarcode("");
      setQuantity("");
    } else {
      alert("Unable to remove stock. Check product availability.");
    }
  };

  return (
    <div>
      <h1>Stock Out</h1>

      <label>Product Code</label>
      <br />
      <select value={productCode} onChange={(e) => setProductCode(e.target.value)}>
        <option value="">Select product</option>
        {products.map((product) => (
          <option key={product.productCode} value={product.productCode}>
            {product.productCode} - {product.productName}
          </option>
        ))}
      </select>
      <br />
      <br />

      <label>Barcode</label>
      <br />
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Scan barcode or enter code"
      />
      <br />
      <br />

      <label>Quantity</label>
      <br />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <br />
      <br />

      <label>Date</label>
      <br />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <br />
      <br />

      <button onClick={saveStockOut}>Save Stock Out</button>

      <hr />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {stockOutRecords.length === 0 ? (
            <tr>
              <td colSpan="4">No stock out records yet.</td>
            </tr>
          ) : (
            stockOutRecords.map((record, index) => {
              const product = products.find((p) => p.productCode === record.productCode);
              return (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{product?.productName || record.productCode}</td>
                  <td>{record.quantity}</td>
                  <td>{record.date}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StockOut;
