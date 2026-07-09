import React from 'react';

export default function ReportSection({ suppliers }) {
  const totalPurchases = suppliers.reduce((sum, supplier) => sum + supplier.amount, 0);
  const paidAmount = suppliers.filter((supplier) => supplier.status === 'Paid').reduce((sum, supplier) => sum + supplier.amount, 0);
  const pendingAmount = suppliers.filter((supplier) => supplier.status === 'Pending').reduce((sum, supplier) => sum + supplier.amount, 0);
  const totalSuppliers = suppliers.length;
  const topSuppliers = [...suppliers].sort((a, b) => b.amount - a.amount).slice(0, 3);
  const statusCounts = suppliers.reduce(
    (summary, supplier) => {
      summary[supplier.status] = (summary[supplier.status] || 0) + 1;
      return summary;
    },
    {}
  );

  return (
    <>
      <div className="cards">
        <div className="card">
          <h4>Total Suppliers</h4>
          <h2>{totalSuppliers}</h2>
        </div>
        <div className="card">
          <h4>Total Purchases</h4>
          <h2>₹{totalPurchases.toLocaleString()}</h2>
        </div>
      </div>
      <div className="cards">
        <div className="card">
          <h4>Paid Total</h4>
          <h2>₹{paidAmount.toLocaleString()}</h2>
        </div>
        <div className="card">
          <h4>Pending Total</h4>
          <h2>₹{pendingAmount.toLocaleString()}</h2>
        </div>
      </div>
      <div className="box">
        <h3>Top Suppliers by Purchase</h3>
        <div className="report-grid">
          {topSuppliers.map((supplier) => (
            <div className="report-card" key={supplier.id}>
              <h4>{supplier.name}</h4>
              <p>Amount: ₹{supplier.amount.toLocaleString()}</p>
              <p>Status: {supplier.status}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="box">
        <h3>Status Distribution</h3>
        <div className="small-chart">
          {['Paid', 'Pending'].map((status) => (
            <div className="chart-row" key={status}>
              <div className="chart-label">{status}</div>
              <div className="bar-container">
                <div
                  className={`bar-fill ${status.toLowerCase()}`}
                  style={{ width: `${Math.round(((statusCounts[status] || 0) / totalSuppliers) * 100)}%` }}
                />
              </div>
              <div className="chart-value">{statusCounts[status] || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
