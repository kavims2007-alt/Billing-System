function Reports({ products, stockInRecords, stockOutRecords }) {
  const totalProducts = products.length;
  const totalStockIn = stockInRecords.reduce((sum, record) => sum + record.quantity, 0);
  const totalStockOut = stockOutRecords.reduce((sum, record) => sum + record.quantity, 0);
  const lowStockCount = products.filter((product) => product.stock <= (product.minStock || 0)).length;
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.stock * product.purchasePrice,
    0
  );

  return (
    <div>
      <h1>Inventory Reports</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Total Products</th>
            <th>Total Stock In</th>
            <th>Total Stock Out</th>
            <th>Low Stock Items</th>
            <th>Inventory Value</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{totalProducts}</td>
            <td>{totalStockIn}</td>
            <td>{totalStockOut}</td>
            <td>{lowStockCount}</td>
            <td>{inventoryValue}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
