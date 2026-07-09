import React from 'react';

export default function SupplierList({ suppliers, search, onSearchChange, onDelete, showDelete = true }) {
  const confirmDelete = (supplier) => {
    if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      onDelete(supplier.id);
    }
  };

  return (
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
            {showDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={showDelete ? '5' : '4'}>No matching suppliers found.</td>
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
                {showDelete && (
                  <td>
                    <button className="button-table button-delete" onClick={() => confirmDelete(supplier)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
