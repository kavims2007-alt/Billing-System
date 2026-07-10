import React from 'react';

export default function SupplierForm({ form, onChange, onSubmit, onClear, editingId }) {
  return (
    <div className="box supplier-form-box">
      <h3>{editingId !== null ? 'Update Supplier' : 'Add Supplier'}</h3>
      <form className="supplier-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="name">Supplier Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="ABC Traders"
            />
          </div>
          <div className="form-row">
            <label htmlFor="invoice">Invoice</label>
            <input
              id="invoice"
              name="invoice"
              value={form.invoice}
              onChange={onChange}
              placeholder="INV005"
            />
          </div>
          <div className="form-row">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={onChange}
              placeholder="45000"
            />
          </div>
          <div className="form-row">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={onChange}>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="button-primary">
            {editingId !== null ? 'Update Supplier' : 'Add Supplier'}
          </button>
          <button type="button" className="button-secondary" onClick={onClear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
