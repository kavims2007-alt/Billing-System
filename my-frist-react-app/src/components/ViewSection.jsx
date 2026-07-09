import React from 'react';

export default function ViewSection({ suppliers, search, onSearchChange }) {
  return (
    <>
      <div className="box">
        <div className="supplier-list-header">
          <h3>Supplier List</h3>
          <div>
            <label htmlFor="search">Search Supplier</label>
            <input
              id="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, invoice, or status"
            />
          </div>
        </div>
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
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="4">No matching suppliers found.</td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.invoice}</td>
                  <td>₹{supplier.amount.toLocaleString()}</td>
                  <td className={supplier.status === 'Paid' ? 'status-paid' : 'status-pending'}>
                    {supplier.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
