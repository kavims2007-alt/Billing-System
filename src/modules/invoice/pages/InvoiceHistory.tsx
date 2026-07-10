import { useEffect, useState } from "react";
import { readInvoiceSettings } from "../data/settings";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

const DEFAULT_COMPANY_NAME = "Royal Nova Pvt Ltd";
const DEFAULT_PAYMENT_NOTE = "Please pay by Cash or UPI.";

interface InvoiceItem {
  product: string;
  quantity: number;
  price: number;
  gst: number;
}

interface Invoice {
  customerName: string;
  phoneNumber: string;
  address: string;
  invoiceDate?: string;
  paymentMethod?: string;
  items: InvoiceItem[];
  discount: number;
  total: number;
  grandTotal: number;
}

// Invoices created by CreateInvoice store an `items` array. Older/legacy
// records may store a single flat product. Normalize both into `items` so the
// table and exports never crash on a missing field.
interface RawInvoice extends Partial<Invoice> {
  product?: string;
  quantity?: number;
  price?: number;
  gst?: number;
}

const normalizeInvoice = (raw: RawInvoice): Invoice => {
  const items: InvoiceItem[] = Array.isArray(raw.items)
    ? raw.items.map((item) => ({
        product: item.product ?? "",
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        gst: Number(item.gst) || 0,
      }))
    : [
        {
          product: raw.product ?? "",
          quantity: Number(raw.quantity) || 0,
          price: Number(raw.price) || 0,
          gst: Number(raw.gst) || 0,
        },
      ];

  return {
    customerName: raw.customerName ?? "",
    phoneNumber: raw.phoneNumber ?? "",
    address: raw.address ?? "",
    invoiceDate: raw.invoiceDate,
    paymentMethod: raw.paymentMethod,
    items,
    discount: Number(raw.discount) || 0,
    total: Number(raw.total) || 0,
    grandTotal: Number(raw.grandTotal) || 0,
  };
};

const getSubtotal = (invoice: Invoice) =>
  invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

const getGstAmount = (invoice: Invoice) =>
  invoice.items.reduce((sum, item) => sum + (item.quantity * item.price * item.gst) / 100, 0);

const getTotalQuantity = (invoice: Invoice) =>
  invoice.items.reduce((sum, item) => sum + item.quantity, 0);

const getProductSummary = (invoice: Invoice) =>
  invoice.items
    .filter((item) => item.product.trim())
    .map((item) => `${item.product} x${item.quantity}`)
    .join(", ") || "-";

function InvoiceHistory({ setCurrentPage: _setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companyName, setCompanyName] = useState(DEFAULT_COMPANY_NAME);
  const [paymentNote, setPaymentNote] = useState(DEFAULT_PAYMENT_NOTE);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices) as RawInvoice[];
        setInvoices(parsed.map(normalizeInvoice));
      } catch {
        setInvoices([]);
      }
    }

    const settings = readInvoiceSettings();
    setCompanyName(settings.companyName || DEFAULT_COMPANY_NAME);
    setPaymentNote(settings.paymentNote || DEFAULT_PAYMENT_NOTE);
  }, []);

  const deleteInvoice = (index: number) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);

    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  const getPrintableInvoiceHtml = (invoice: Invoice) => {
    const itemRows = invoice.items
      .map(
        (item) => `
          <tr>
            <td>${item.product}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
            <td style="text-align:center;">${item.gst}%</td>
            <td style="text-align:right;">₹${(item.quantity * item.price).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          .invoice-box { border: 1px solid #ddd; padding: 24px; max-width: 700px; margin: 0 auto; }
          .company { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px; }
          .subtitle { text-align: center; margin-bottom: 20px; color: #555; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background: #f4f4f4; text-align: left; }
          .totals { margin-top: 12px; }
          .note { margin-top: 16px; font-weight: bold; color: #0b5fff; }
          @media print { body { padding: 0; } .invoice-box { border: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="company">${companyName}</div>
          <div class="subtitle">Invoice</div>
          <div class="row"><span class="label">Customer:</span><span>${invoice.customerName}</span></div>
          <div class="row"><span class="label">Phone:</span><span>${invoice.phoneNumber}</span></div>
          <div class="row"><span class="label">Address:</span><span>${invoice.address}</span></div>
          <div class="row"><span class="label">Date:</span><span>${invoice.invoiceDate || "-"}</span></div>
          <div class="row"><span class="label">Payment:</span><span>${invoice.paymentMethod || "Cash / UPI"}</span></div>
          <table>
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Price</th><th>GST</th><th>Amount</th></tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div class="totals">
            <div class="row"><span class="label">Subtotal:</span><span>₹${getSubtotal(invoice).toFixed(2)}</span></div>
            <div class="row"><span class="label">GST:</span><span>₹${getGstAmount(invoice).toFixed(2)}</span></div>
            <div class="row"><span class="label">Discount:</span><span>${invoice.discount}%</span></div>
            <div class="row"><span class="label">Grand Total:</span><span>₹${invoice.grandTotal.toFixed(2)}</span></div>
          </div>
          <div class="note">${paymentNote}</div>
        </div>
      </body>
    </html>
  `;
  };

  const downloadPDF = async (invoice: Invoice) => {
    // Loaded on demand so the ~350 kB jsPDF bundle stays out of the initial load.
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(companyName, 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Invoice", 105, 30, { align: "center" });

    const headerLines = [
      `Customer: ${invoice.customerName}`,
      `Phone: ${invoice.phoneNumber}`,
      `Address: ${invoice.address}`,
      `Date: ${invoice.invoiceDate || "-"}`,
      `Payment: ${invoice.paymentMethod || "Cash / UPI"}`,
    ];

    let y = 45;
    headerLines.forEach((line) => {
      doc.text(line, 20, y);
      y += 7;
    });

    y += 3;
    doc.setFont("helvetica", "bold");
    doc.text("Items:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 7;

    invoice.items.forEach((item) => {
      const line = `${item.product}  |  Qty: ${item.quantity}  |  Price: ${item.price.toFixed(
        2
      )}  |  GST: ${item.gst}%  |  Amount: ${(item.quantity * item.price).toFixed(2)}`;
      doc.text(line, 20, y);
      y += 7;
    });

    y += 3;
    const totalLines = [
      `Subtotal: ${getSubtotal(invoice).toFixed(2)}`,
      `GST: ${getGstAmount(invoice).toFixed(2)}`,
      `Discount: ${invoice.discount}%`,
      `Grand Total: ${invoice.grandTotal.toFixed(2)}`,
      `Note: ${paymentNote}`,
    ];
    totalLines.forEach((line) => {
      doc.text(line, 20, y);
      y += 7;
    });

    doc.save(`${invoice.customerName || "invoice"}-invoice.pdf`);
  };

  const printInvoice = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the invoice.");
      return;
    }

    printWindow.document.write(getPrintableInvoiceHtml(invoice));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <>
      <h2>Invoice History</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone Number</th>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>GST</th>
            <th>Discount</th>
            <th>Grand Total</th>
            <th>Action</th>
            <th>Print</th>
            <th>PDF</th>
          </tr>
        </thead>

        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <tr key={index}>
                <td>{invoice.customerName}</td>
                <td>{invoice.phoneNumber}</td>
                <td>{getProductSummary(invoice)}</td>
                <td>{getTotalQuantity(invoice)}</td>
                <td>₹{getSubtotal(invoice).toFixed(2)}</td>
                <td>₹{getGstAmount(invoice).toFixed(2)}</td>
                <td>{invoice.discount}%</td>
                <td>₹{invoice.grandTotal.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteInvoice(index)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => printInvoice(invoice)}
                  >
                    Print
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => downloadPDF(invoice)}
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center">
                No Invoice Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default InvoiceHistory;
