import React from 'react';

export default function HistorySection({ suppliers, onToggleStatus }) {
  const totalPurchases = suppliers.reduce((sum, supplier) => sum + supplier.amount, 0);
  const paidAmount = suppliers.filter((supplier) => supplier.status === 'Paid').reduce((sum, supplier) => sum + supplier.amount, 0);
  const pendingAmount = suppliers.filter((supplier) => supplier.status === 'Pending').reduce((sum, supplier) => sum + supplier.amount, 0);

  return (
    <>
      <div className="cards">
        <div className="card">
          <h4>Total Purchases</h4>
          <h2>₹{totalPurchases.toLocaleString()}</h2>
        </div>
        <div className="card">
          <h4>Paid Total</h4>
          <h2>₹{paidAmount.toLocaleString()}</h2>
        </div>
        <div className="card">
          <h4>Outstanding Total</h4>
          <h2>₹{pendingAmount.toLocaleString()}</h2>
        </div>
        <div className="card">
          <h4>Supplier Count</h4>
          <h2>{suppliers.length}</h2>
        </div>
      </div>

      <div className="box">
        <h3>Purchase History</h3>
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.invoice}</td>
                <td>₹{supplier.amount.toLocaleString()}</td>
                <td>
                  <div className="status-cell">
                    <span className={`status-chip ${supplier.status === 'Paid' ? 'status-paid' : 'status-pending'}`}>
                      {supplier.status}
                    </span>
                    <button
                      className="button-table button-toggle"
                      onClick={() => {
                        const nextStatus = supplier.status === 'Paid' ? 'Pending' : 'Paid';
                        if (window.confirm(`Mark ${supplier.name} as ${nextStatus}?`)) {
                          onToggleStatus(supplier.id);
                        }
                      }}
                    >
                      {supplier.status === 'Paid' ? 'Set Pending' : 'Set Paid'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
