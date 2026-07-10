function ProductList({ products, onDelete, onEdit }) {
  return (
    <div>
      <h1>Product List</h1>

      {products.length === 0 ? (
        <p>No products available. Add a product first.</p>
      ) : (
        <div className="table-wrapper">
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>S.No</th>
                <th className="sticky-col name">Product Name</th>
                <th className="sticky-col code">Product Code</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>GST</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Unit</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={`${product.productCode}-${index}`}>
                  <td>{index + 1}</td>
                  <td className="sticky-col name">{product.productName}</td>
                  <td className="sticky-col code">{product.productCode}</td>
                  <td>{product.barcode || "—"}</td>
                  <td>{product.category}</td>
                  <td>{product.purchasePrice}</td>
                  <td>{product.sellingPrice}</td>
                  <td>{product.gst}%</td>
                  <td>{product.stock}</td>
                  <td>{product.minStock}</td>
                  <td>{product.unit}</td>
                  <td>
                    <div className="action-cell">
                      <button
                        className="action-btn edit"
                        onClick={() => onEdit(product.productCode)}
                        title="Edit product"
                        aria-label="Edit product"
                      >
                        ✎
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => onDelete(product.productCode)}
                        title="Delete product"
                        aria-label="Delete product"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductList;
