import { useEffect, useState } from "react";
import {
  defaultSettings,
  readInvoiceSettings,
  saveInvoiceSettings,
} from "../data/settings";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

function Settings({ setCurrentPage: _setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  const [companyName, setCompanyName] = useState(defaultSettings.companyName);
  const [paymentNote, setPaymentNote] = useState(defaultSettings.paymentNote);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const settings = readInvoiceSettings();
    setCompanyName(settings.companyName);
    setPaymentNote(settings.paymentNote);
  }, []);

  const handleSave = () => {
    saveInvoiceSettings({ companyName, paymentNote });
    setMessage("Settings saved successfully.");
  };

  return (
    <>
      <h2>Settings</h2>
      <p className="text-muted">Update your company details and payment note used in invoices.</p>

      <div className="card shadow p-4 mt-3" style={{ maxWidth: 700 }}>
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            className="form-control"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Note</label>
          <textarea
            className="form-control"
            rows={3}
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
          />
        </div>

        <button className="btn btn-success" onClick={handleSave}>
          Save Settings
        </button>

        {message && <div className="alert alert-success mt-3">{message}</div>}
      </div>
    </>
  );
}

export default Settings;
