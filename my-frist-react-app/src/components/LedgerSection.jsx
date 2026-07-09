import React from 'react';

export default function LedgerSection({ suppliers }) {
  const totalSuppliers = suppliers.length;
  const statusCounts = suppliers.reduce(
    (summary, supplier) => {
      summary[supplier.status] = (summary[supplier.status] || 0) + 1;
      return summary;
    },
    {}
  );

  return (
    <>
      <div className="box">
        <h3>Supplier Ledger</h3>
        <div className="report-grid">
          {suppliers.map((supplier) => (
            <div className="report-card" key={supplier.id}>
              <h4>{supplier.name}</h4>
              <p>Invoice: {supplier.invoice}</p>
              <p>Balance: ₹{supplier.amount.toLocaleString()}</p>
              <p>Status: {supplier.status}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="box">
        <h3>Ledger Summary</h3>
        <div className="small-chart">
          <div className="chart-row">
            <div className="chart-label">Paid Suppliers</div>
            <div className="bar-container">
              <div className="bar-fill paid" style={{ width: `${Math.round(((statusCounts.Paid || 0) / totalSuppliers) * 100)}%` }} />
            </div>
            <div className="chart-value">{statusCounts.Paid || 0}</div>
          </div>
          <div className="chart-row">
            <div className="chart-label">Pending Suppliers</div>
            <div className="bar-container">
              <div className="bar-fill pending" style={{ width: `${Math.round(((statusCounts.Pending || 0) / totalSuppliers) * 100)}%` }} />
            </div>
            <div className="chart-value">{statusCounts.Pending || 0}</div>
          </div>
        </div>
      </div>
    </>
  );
}
