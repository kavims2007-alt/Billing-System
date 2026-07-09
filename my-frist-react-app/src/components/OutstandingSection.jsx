import React from 'react';

export default function OutstandingSection({ suppliers }) {
  const outstandingAmount = suppliers
    .filter((supplier) => supplier.status === 'Pending')
    .reduce((sum, supplier) => sum + supplier.amount, 0);
  const pendingPayments = suppliers.filter((supplier) => supplier.status === 'Pending').length;
  const paidAmount = suppliers.filter((supplier) => supplier.status === 'Paid').reduce((sum, supplier) => sum + supplier.amount, 0);

  return (
    <>
      <div className="cards">
        <div className="card">
          <h4>Outstanding Amount</h4>
          <h2>₹{outstandingAmount.toLocaleString()}</h2>
        </div>
        <div className="card">
          <h4>Pending Payments</h4>
          <h2>{pendingPayments}</h2>
        </div>
      </div>

      <div className="box">
        <h3>Outstanding Supplier Balances</h3>
        <div className="report-grid">
          {suppliers
            .filter((supplier) => supplier.status === 'Pending')
            .map((supplier) => (
              <div className="report-card" key={supplier.id}>
                <h4>{supplier.name}</h4>
                <p>{supplier.invoice}</p>
                <p>Amount: ₹{supplier.amount.toLocaleString()}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="box">
        <h3>Paid vs Pending Breakdown</h3>
        <div className="small-chart">
          <div className="chart-row">
            <div className="chart-label">Paid</div>
            <div className="bar-container">
              <div className="bar-fill paid" style={{ width: `${Math.round((paidAmount / (paidAmount + outstandingAmount || 1)) * 100)}%` }} />
            </div>
            <div className="chart-value">₹{paidAmount.toLocaleString()}</div>
          </div>
          <div className="chart-row">
            <div className="chart-label">Pending</div>
            <div className="bar-container">
              <div className="bar-fill pending" style={{ width: `${Math.round((outstandingAmount / (paidAmount + outstandingAmount || 1)) * 100)}%` }} />
            </div>
            <div className="chart-value">₹{outstandingAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
