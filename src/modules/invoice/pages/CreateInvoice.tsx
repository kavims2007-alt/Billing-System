import { useEffect, useState } from "react";
import { productCatalog } from "../data/products";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

interface InvoiceItem {
  product: string;
  searchText: string;
  quantity: number;
  price: number;
  gst: number;
  stock: number;
  showSuggestions: boolean;
}

interface Invoice {
  customerName: string;
  phoneNumber: string;
  address: string;
  invoiceDate: string;
  paymentMethod: string;
  items: InvoiceItem[];
  discount: number;
  total: number;
  grandTotal: number;
}

interface Customer {
  customerName: string;
  phoneNumber: string;
  address: string;
}

function CreateInvoice({ setCurrentPage: _setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      product: "",
      searchText: "",
      quantity: 1,
      price: 0,
      gst: 0,
      stock: 0,
      showSuggestions: false,
    },
  ]);
  const [message, setMessage] = useState("");
  const [addProductFeedback, setAddProductFeedback] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [, setCustomers] = useState<Customer[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedCustomers = localStorage.getItem("customers");
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedInvoices = localStorage.getItem("invoices");
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });

  const subtotal = invoiceItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const gstAmount = invoiceItems.reduce(
    (sum, item) => sum + (item.quantity * item.price * item.gst) / 100,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal + gstAmount - discountAmount;

  useEffect(() => {
    if (phoneNumber === "9363738441") {
      setCustomerName("Harish");
      setAddress("Dharmapuri");
    } else if (phoneNumber === "8098836751") {
      setCustomerName("Kanishkar");
      setAddress("Dharmapuri");
    }
  }, [phoneNumber]);

  const updateItem = (index: number, updates: Partial<InvoiceItem>) => {
    setInvoiceItems((prevItems) =>
      prevItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item
      )
    );
  };

  const handleAddProduct = () => {
    setInvoiceItems((prevItems) => [
      ...prevItems,
      {
        product: "",
        searchText: "",
        quantity: 1,
        price: 0,
        gst: 0,
        stock: 0,
        showSuggestions: false,
      },
    ]);
    setIsAddingProduct(true);
    setAddProductFeedback("Product row added. You can continue adding more.");

    window.setTimeout(() => {
      setIsAddingProduct(false);
      setAddProductFeedback("");
    }, 1200);
  };

  const removeItem = (index: number) => {
    setInvoiceItems((prevItems) => prevItems.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    field: "product" | "quantity" | "price" | "gst"
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "product") {
        const nextItem = document.querySelector<HTMLInputElement>(
          `input[data-field="product-${index + 1}"]`
        );
        if (nextItem) {
          nextItem.focus();
        } else {
          handleAddProduct();
          setTimeout(() => {
            const newItem = document.querySelector<HTMLInputElement>(
              `input[data-field="product-${invoiceItems.length}"]`
            );
            newItem?.focus();
          }, 50);
        }
      }
    }
  };

  const saveInvoice = () => {
    const validItems = invoiceItems.filter((item) => item.product.trim());

    if (validItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const stockIssue = validItems.some(
      (item) => item.stock > 0 && item.quantity > item.stock
    );

    if (stockIssue) {
      alert("Stock not available for one or more products!");
      return;
    }

    const newInvoice: Invoice = {
      customerName,
      phoneNumber,
      address,
      invoiceDate,
      paymentMethod,
      items: validItems,
      discount,
      total: subtotal,
      grandTotal,
    };

    setInvoices((prevInvoices) => {
      const updatedInvoices = [...prevInvoices, newInvoice];
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });

    setCustomers((prevCustomers) => {
      const customerExists = prevCustomers.some(
        (customer) => customer.phoneNumber === phoneNumber
      );
      if (customerExists) {
        return prevCustomers;
      }

      const updatedCustomers = [
        ...prevCustomers,
        { customerName, phoneNumber, address },
      ];
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      return updatedCustomers;
    });

    setInvoiceDate("");
    setPaymentMethod("Cash");
    setCustomerName("");
    setPhoneNumber("");
    setAddress("");
    setInvoiceItems([
      {
        product: "",
        searchText: "",
        quantity: 1,
        price: 0,
        gst: 0,
        stock: 0,
        showSuggestions: false,
      },
    ]);
    setDiscount(0);

    setMessage(`Invoice saved successfully (${paymentMethod})`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Create Invoice</h2>

      <div className="card shadow p-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Invoice Date</label>
            <input
              type="date"
              className="form-control"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Discount (%)</label>
            <input
              type="number"
              className="form-control"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Products</label>
            {invoiceItems.map((item, index) => {
              const filteredProducts = productCatalog.filter((productItem) =>
                productItem.name.toLowerCase().startsWith(item.searchText.toLowerCase())
              );

              return (
                <div key={index} className="border rounded p-3 mb-3">
                  <div className="row g-2">
                    <div className="col-md-4 position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type product name"
                        data-field={`product-${index}`}
                        value={item.searchText}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateItem(index, {
                            searchText: value,
                            showSuggestions: value.trim().length >= 2,
                            product: value.trim() ? item.product : "",
                          });
                        }}
                        onFocus={() => updateItem(index, { showSuggestions: item.searchText.trim().length >= 2 })}
                        onBlur={() => setTimeout(() => updateItem(index, { showSuggestions: false }), 150)}
                        onKeyDown={(event) => handleKeyDown(event, index, "product")}
                      />
                      {item.showSuggestions && item.searchText.trim().length >= 2 && (
                        <div className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 20, maxHeight: 220, overflowY: "auto" }}>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((productItem) => (
                              <button
                                key={productItem.name}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  updateItem(index, {
                                    product: productItem.name,
                                    searchText: productItem.name,
                                    price: productItem.price,
                                    gst: productItem.gst,
                                    stock: productItem.stock,
                                    showSuggestions: false,
                                  });
                                }}
                              >
                                <span>{productItem.name}</span>
                                <small className="text-muted">₹{productItem.price} • GST {productItem.gst}%</small>
                              </button>
                            ))
                          ) : (
                            <div className="list-group-item text-muted">No matching product</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Qty"
                        data-field={`quantity-${index}`}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, { quantity: Number(e.target.value) })
                        }
                        onKeyDown={(event) => handleKeyDown(event, index, "quantity")}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        data-field={`price-${index}`}
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, { price: Number(e.target.value) })
                        }
                        onKeyDown={(event) => handleKeyDown(event, index, "price")}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="GST"
                        data-field={`gst-${index}`}
                        value={item.gst}
                        onChange={(e) => updateItem(index, { gst: Number(e.target.value) })}
                        onKeyDown={(event) => handleKeyDown(event, index, "gst")}
                      />
                    </div>

                    <div className="col-md-2">
                      <div className="text-muted small">Stock: {item.stock || 0}</div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => removeItem(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-12 mb-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <button
                className={`btn ${isAddingProduct ? "btn-outline-success" : "btn-primary"}`}
                onClick={handleAddProduct}
              >
                {isAddingProduct ? "✓ Added" : "+ Add Product"}
              </button>

              <div className="text-end">
                <div>Total: ₹{subtotal.toFixed(2)}</div>
                <div>Grand Total: ₹{grandTotal.toFixed(2)}</div>
              </div>
            </div>
            {addProductFeedback && (
              <div className="alert alert-info py-2 mt-3 mb-0">{addProductFeedback}</div>
            )}
          </div>

          <div className="col-12 mb-3">
            <button className="btn btn-success w-100" onClick={saveInvoice}>
              Save Invoice
            </button>
            {message && <div className="alert alert-success mt-3">{message}</div>}
          </div>

          {invoices.length > 0 && (
            <div className="col-12 mt-4">
              <h4>Invoice History</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Payment</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={index}>
                      <td>{invoice.customerName}</td>
                      <td>
                        {invoice.items
                          .map((item) => `${item.product} x${item.quantity}`)
                          .join(", ") || "-"}
                      </td>
                      <td>{invoice.paymentMethod}</td>
                      <td>₹{invoice.grandTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateInvoice;