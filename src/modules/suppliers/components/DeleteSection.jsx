import React, { useState } from 'react';

export default function DeleteSection({ suppliers, search, onSearchChange, onDelete }) {
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const openConfirmModal = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const closeConfirmModal = () => {
    setSelectedSupplier(null);
  };

  const confirmDelete = () => {
    if (selectedSupplier) {
      onDelete(selectedSupplier.id);
      closeConfirmModal();
    }
  };

  return (
    <>
      <div className="box">
        <div className="supplier-list-header">
          <h3>Delete Supplier</h3>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="5">No matching suppliers found.</td>
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
                  <td>
                    <button
                      className="button-table button-delete"
                      onClick={() => openConfirmModal(supplier)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedSupplier && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete <strong>{selectedSupplier.name}</strong>?</p>
            <div className="modal-actions">
              <button className="button-table button-delete" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="button-table button-secondary" onClick={closeConfirmModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
