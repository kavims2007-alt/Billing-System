import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct({ products, onUpdate }) {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const existing = products.find((p) => p.productCode === productCode);
    if (existing) {
      setProduct(existing);
    }
  }, [productCode, products]);

  const handleSave = () => {
    if (!product?.productName || !product?.productCode) {
      alert("Please fill in the product name and product code.");
      return;
    }

    onUpdate(product);
    navigate("/products");
  };

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div>
      <h1>Edit Product</h1>

      <label>Product Name</label>
      <br />
      <input
        type="text"
        value={product.productName}
        onChange={(e) =>
          setProduct((prev) => ({ ...prev, productName: e.target.value }))
        }
      />
      <br />
      <br />

      <label>Product Code</label>
      <br />
      <input type="text" value={product.productCode} disabled />
      <br />
      <br />

      <label>Category</label>
      <br />
      <input
        type="text"
        value={product.category}
        onChange={(e) =>
          setProduct((prev) => ({ ...prev, category: e.target.value }))
        }
      />
      <br />
      <br />

      <label>Purchase Price</label>
      <br />
      <input
        type="number"
        value={product.purchasePrice}
        onChange={(e) =>
          setProduct((prev) => ({
            ...prev,
            purchasePrice: Number(e.target.value) || 0,
          }))
        }
      />
      <br />
      <br />

      <label>Selling Price</label>
      <br />
      <input
        type="number"
        value={product.sellingPrice}
        onChange={(e) =>
          setProduct((prev) => ({
            ...prev,
            sellingPrice: Number(e.target.value) || 0,
          }))
        }
      />
      <br />
      <br />

      <label>GST %</label>
      <br />
      <input
        type="number"
        value={product.gst}
        onChange={(e) =>
          setProduct((prev) => ({ ...prev, gst: Number(e.target.value) || 0 }))
        }
      />
      <br />
      <br />

      <label>Stock Quantity</label>
      <br />
      <input
        type="number"
        value={product.stock}
        onChange={(e) =>
          setProduct((prev) => ({ ...prev, stock: Number(e.target.value) || 0 }))
        }
      />
      <br />
      <br />

      <label>Unit</label>
      <br />
      <input
        type="text"
        value={product.unit}
        onChange={(e) =>
          setProduct((prev) => ({ ...prev, unit: e.target.value }))
        }
      />
      <br />
      <br />

      <button onClick={handleSave}>Update Product</button>
    </div>
  );
}

export default EditProduct;
