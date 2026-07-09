import { productCatalog } from "../data/products";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

function Products({ setCurrentPage: _setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  return (
    <>
      <h2 className="mb-4">Products</h2>

      <div className="mb-3 text-muted">
        Total products: {productCatalog.length}
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Price (₹)</th>
            <th>GST (%)</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {productCatalog.map((product, index) => (
            <tr key={product.name}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString("en-IN")}</td>
              <td>{product.gst}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Products;