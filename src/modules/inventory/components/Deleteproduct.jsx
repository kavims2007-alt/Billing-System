function DeleteProduct({ products, onDelete, onNavigate }) {
  return (
    <div>
      <h1>Delete Product</h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Product Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={`${product.productCode}-${index}`}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.productCode}</td>
                <td>
                  <button
                    onClick={() => {
                      onDelete(product.productCode);
                      onNavigate("products");
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DeleteProduct;
