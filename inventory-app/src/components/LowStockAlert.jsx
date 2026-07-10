function LowStockAlert({ products }) {
  const lowProducts = products.filter(
    (product) => product.stock <= (product.minStock || 0)
  );

  return (
    <div>
      <h1>Low Stock Alert</h1>

      {lowProducts.length === 0 ? (
        <p>No low stock items at the moment.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Barcode</th>
              <th>Current Stock</th>
              <th>Minimum Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {lowProducts.map((product, index) => (
              <tr key={`${product.productCode}-${index}`}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.barcode || "—"}</td>
                <td>{product.stock}</td>
                <td>{product.minStock}</td>
                <td>Low Stock</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LowStockAlert;
