import React from 'react';

export default function Dashboard({ suppliers, activities, onNavigate }) {
  const totalSuppliers = suppliers.length;
  const totalPurchases = suppliers.reduce((sum, supplier) => sum + supplier.amount, 0);
  const outstandingAmount = suppliers
    .filter((supplier) => supplier.status === 'Pending')
    .reduce((sum, supplier) => sum + supplier.amount, 0);
  const pendingPayments = suppliers.filter((supplier) => supplier.status === 'Pending').length;

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
        <h3>Quick Dashboard Actions</h3>
        <div className="dashboard-actions">
          <button className="button-primary" onClick={() => onNavigate('add')}>
             Add Supplier
          </button>
          <button className="button-primary" onClick={() => onNavigate('view')}>
             View Supplier List
          </button>
          <button className="button-primary" onClick={() => onNavigate('search')}>
             Search Supplier
          </button>
          <button className="button-primary" onClick={() => onNavigate('update')}>
             Update Supplier
          </button>
          <button className="button-primary" onClick={() => onNavigate('delete')}>
             Delete Supplier
          </button>
          <button className="button-primary" onClick={() => onNavigate('history')}>
             Purchase History
          </button>
          <button className="button-primary" onClick={() => onNavigate('outstanding')}>
             Outstanding Payments
          </button>
          <button className="button-primary" onClick={() => onNavigate('ledger')}>
             Supplier Ledger
          </button>
        </div>
      </div>

      <div className="content">
        <div className="box">
          <h3>Recent Transactions</h3>
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
              {suppliers.slice(0, 4).map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.invoice}</td>
                  <td>₹{supplier.amount.toLocaleString()}</td>
                  <td className={supplier.status === 'Paid' ? 'status-paid' : 'status-pending'}>
                    {supplier.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="box">
          <h3>Recent Activities</h3>
          {activities.map((activity, index) => (
            <div className="activity" key={index}>
              {activity}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
