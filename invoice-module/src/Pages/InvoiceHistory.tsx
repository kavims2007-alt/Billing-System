import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { readInvoiceSettings } from "../data/settings";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

const DEFAULT_COMPANY_NAME = "Royal Nova Pvt Ltd";
const DEFAULT_PAYMENT_NOTE = "Please pay by Cash or UPI.";

interface Invoice {
  customerName: string;
  phoneNumber: string;
  address: string;
  invoiceDate?: string;
  paymentMethod?: string;
  product: string;
  quantity: number;
  price: number;
  gst: number;
  discount: number;
  total: number;
  grandTotal: number;
}

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
      setInvoices(JSON.parse(savedInvoices));
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

  const getPrintableInvoiceHtml = (invoice: Invoice) => `
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
          <div class="row"><span class="label">Product:</span><span>${invoice.product}</span></div>
          <div class="row"><span class="label">Quantity:</span><span>${invoice.quantity}</span></div>
          <div class="row"><span class="label">Price:</span><span>₹${invoice.price.toFixed(2)}</span></div>
          <div class="row"><span class="label">GST:</span><span>${invoice.gst}%</span></div>
          <div class="row"><span class="label">Discount:</span><span>${invoice.discount}%</span></div>
          <div class="row"><span class="label">Total:</span><span>₹${invoice.total.toFixed(2)}</span></div>
          <div class="row"><span class="label">Grand Total:</span><span>₹${invoice.grandTotal.toFixed(2)}</span></div>
          <div class="note">${paymentNote}</div>
        </div>
      </body>
    </html>
  `;

  const downloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(companyName, 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Invoice", 105, 30, { align: "center" });

    const lines = [
      `Customer: ${invoice.customerName}`,
      `Phone: ${invoice.phoneNumber}`,
      `Address: ${invoice.address}`,
      `Date: ${invoice.invoiceDate || "-"}`,
      `Payment: ${invoice.paymentMethod || "Cash / UPI"}`,
      `Product: ${invoice.product}`,
      `Quantity: ${invoice.quantity}`,
      `Price: ₹${invoice.price.toFixed(2)}`,
      `GST: ${invoice.gst}%`,
      `Discount: ${invoice.discount}%`,
      `Total: ₹${invoice.total.toFixed(2)}`,
      `Grand Total: ₹${invoice.grandTotal.toFixed(2)}`,
      `Note: ${paymentNote}`,
    ];

    lines.forEach((line, index) => {
      doc.text(line, 20, 45 + index * 7);
    });

    doc.save(`${invoice.customerName}-invoice.pdf`);
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
            <th>Product</th>
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
                <td>{invoice.product}</td>
                <td>{invoice.quantity}</td>
                <td>₹{invoice.price.toFixed(2)}</td>
                <td>{invoice.gst}%</td>
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
