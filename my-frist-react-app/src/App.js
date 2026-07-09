import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SupplierForm from './components/SupplierForm';
import SupplierList from './components/SupplierList';
import DeleteSection from './components/DeleteSection';
import HistorySection from './components/HistorySection';
import OutstandingSection from './components/OutstandingSection';
import LedgerSection from './components/LedgerSection';

const initialSuppliers = [
  { id: 1, name: 'ABC Traders', invoice: 'INV001', amount: 50000, status: 'Paid' },
  { id: 2, name: 'XYZ Suppliers', invoice: 'INV002', amount: 75000, status: 'Pending' },
  { id: 3, name: 'Global Traders', invoice: 'INV003', amount: 120000, status: 'Paid' },
  { id: 4, name: 'Metro Suppliers', invoice: 'INV004', amount: 45000, status: 'Pending' },
  { id: 5, name: 'North Star Supply', invoice: 'INV005', amount: 86000, status: 'Paid' },
  { id: 6, name: 'Prime Goods Co.', invoice: 'INV006', amount: 92000, status: 'Pending' },
  { id: 7, name: 'BluePeak Traders', invoice: 'INV007', amount: 64000, status: 'Paid' },
  { id: 8, name: 'Evergreen Supplies', invoice: 'INV008', amount: 110000, status: 'Pending' },
  { id: 9, name: 'Sunrise Materials', invoice: 'INV009', amount: 78000, status: 'Paid' },
  { id: 10, name: 'Delta Distribution', invoice: 'INV010', amount: 99000, status: 'Pending' },
];

const pageConfig = {
  dashboard: {
    title: 'Vendor/Supplier Management Dashboard',
    description: 'Welcome to the Vendor Management System',
  },
  inventory: {
    title: 'Product & Inventory Management Module',
    description: 'Track products, stock levels, and inventory updates.',
  },
  invoice: {
    title: 'Invoice Module',
    description: 'Create, review, and manage invoices.',
  },
  purchase: {
    title: 'Purchase Module',
    description: 'Manage purchases and procurement activity.',
  },
  add: {
    title: 'Add Supplier',
    description: 'Create a new supplier record with invoice and payment status.',
  },
  view: {
    title: 'View Supplier List',
    description: 'Search, review, and manage existing suppliers.',
  },
  search: {
    title: 'Search Supplier',
    description: 'Search suppliers by name, invoice number, or payment status.',
  },
  update: {
    title: 'Update Supplier',
    description: 'Select a supplier from the list and update its details.',
  },
  delete: {
    title: 'Delete Supplier',
    description: 'Remove supplier records from the system.',
  },
  history: {
    title: 'Purchase History',
    description: 'Review supplier purchase history and totals.',
  },
  outstanding: {
    title: 'Outstanding Payments',
    description: 'Track pending payments and overdue supplier balances.',
  },
  ledger: {
    title: 'Supplier Ledger',
    description: 'View a ledger-style summary of supplier activity.',
  },
};

const menuItems = [
  { key: 'dashboard', label: 'Vendor/Supplier Management Module' },
  { key: 'inventory', label: 'Product & Inventory Management Module' },
  { key: 'invoice', label: 'Invoice Module' },
  { key: 'purchase', label: 'Purchase Module' },
];

// Quick actions are rendered in the header for a compact dashboard experience

function App() {
  const [page, setPage] = useState(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      return hash || 'dashboard';
    } catch (e) {
      return 'dashboard';
    }
  });
  const [suppliers, setSuppliers] = useState(() => {
    try {
      const stored = localStorage.getItem('suppliers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= initialSuppliers.length) {
          return parsed;
        }
      }
    } catch (e) {
      // fall back to the sample supplier list
    }
    return initialSuppliers;
  });
  const [form, setForm] = useState({
    name: '',
    invoice: '',
    amount: '',
    status: 'Paid',
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([
    '✔ Supplier "ABC Traders" added',
    '✔ Payment of ₹50,000 received',
    '✔ Purchase order created',
    '✔ Supplier details updated',
    '✔ Outstanding payment reminder sent',
  ]);

  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Push history state when the page changes so browser Back/Forward work
  useEffect(() => {
    try {
      const state = { page };
      if (window.history && window.history.pushState) {
        window.history.pushState(state, '', `#${page}`);
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [page]);

  // Handle Back/Forward navigation
  useEffect(() => {
    const onPop = (e) => {
      const newPage = (e.state && e.state.page) || window.location.hash.replace('#', '') || 'dashboard';
      setPage(newPage);
    };

    try {
      window.addEventListener('popstate', onPop);
      // Ensure current state reflects initial page (derive from URL/hash)
      const current = window.location.hash.replace('#', '') || 'dashboard';
      if (!window.history.state || window.history.state.page !== current) {
        window.history.replaceState({ page: current }, '', `#${current}`);
      }
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        window.removeEventListener('popstate', onPop);
      } catch (e) {}
    };
  }, []);

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter((supplier) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return [supplier.name, supplier.invoice, supplier.status]
          .join(' ')
          .toLowerCase()
          .includes(query);
      }),
    [suppliers, search]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: '', invoice: '', amount: '', status: 'Paid' });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.invoice.trim() || !form.amount.trim()) {
      return;
    }

    const normalizedSupplier = {
      ...form,
      amount: Number(form.amount),
    };

    if (editingId !== null) {
      setSuppliers((current) =>
        current.map((supplier) =>
          supplier.id === editingId ? { ...supplier, ...normalizedSupplier } : supplier
        )
      );
      setActivities((current) => [
        `✔ Supplier "${form.name}" updated`,
        ...current.slice(0, 4),
      ]);
    } else {
      setSuppliers((current) => [
        ...current,
        { id: Date.now(), ...normalizedSupplier },
      ]);
      setActivities((current) => [
        `✔ Supplier "${form.name}" added`,
        ...current.slice(0, 4),
      ]);
    }

    resetForm();
    setPage('view');
  };

  const handleDelete = (id) => {
    const supplier = suppliers.find((item) => item.id === id);
    setSuppliers((current) => current.filter((item) => item.id !== id));
    setActivities((current) => [
      `✔ Supplier "${supplier?.name || 'Supplier'}" deleted`,
      ...current.slice(0, 4),
    ]);
    if (editingId === id) {
      resetForm();
    }
    setPage('delete');
  };

  const handleToggleStatus = (id) => {
    setSuppliers((current) => {
      const updated = current.map((supplier) =>
        supplier.id === id
          ? {
              ...supplier,
              status: supplier.status === 'Paid' ? 'Pending' : 'Paid',
            }
          : supplier
      );
      const supplier = current.find((item) => item.id === id);
      const nextStatus = supplier?.status === 'Paid' ? 'Pending' : 'Paid';
      setActivities((currentActivities) => [
        `✔ Supplier "${supplier?.name || 'Supplier'}" marked ${nextStatus}`,
        ...currentActivities.slice(0, 4),
      ]);
      return updated;
    });
  };

  return (
    <div className="app">
      <Sidebar menuItems={menuItems} page={page} setPage={setPage} />
      <div className="main">
        <Header
          title={pageConfig[page]?.title || 'Vendor/Supplier Management Dashboard'}
          description={pageConfig[page]?.description || 'Welcome to the Vendor Management System'}
        />

        {/* Back button to return to dashboard when not on dashboard */}
        {page !== 'dashboard' && (
          <div style={{ margin: '12px 0' }}>
            <button className="button-secondary back-button" onClick={() => setPage('dashboard')}>← Back</button>
          </div>
        )}

        {page === 'dashboard' && (
          <Dashboard
            suppliers={suppliers}
            activities={activities}
            onNavigate={setPage}
          />
        )}
        {page === 'inventory' && (
          <div className="box">
            <h3>Product & Inventory Management Module</h3>
            <p>This section can be used to track products, stock levels, and inventory updates.</p>
          </div>
        )}
        {page === 'invoice' && (
          <div className="box">
            <h3>Invoice Module</h3>
            <p>This section can be used to create, review, and manage invoices.</p>
          </div>
        )}
        {page === 'purchase' && (
          <div className="box">
            <h3>Purchase Module</h3>
            <p>This section can be used to manage purchase orders and procurement activity.</p>
          </div>
        )}
        {page === 'add' && (
          <SupplierForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClear={resetForm}
            editingId={editingId}
          />
        )}
        {page === 'view' && (
          <SupplierList
            suppliers={filteredSuppliers}
            search={search}
            onSearchChange={setSearch}
            onDelete={handleDelete}
          />
        )}
        {page === 'search' && (
          <SupplierList
            suppliers={filteredSuppliers}
            search={search}
            onSearchChange={setSearch}
            onDelete={handleDelete}
            showDelete={false}
          />
        )}
        {page === 'update' && (
          <>
            <SupplierForm
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClear={resetForm}
              editingId={editingId}
            />
            <SupplierList
              suppliers={filteredSuppliers}
              search={search}
              onSearchChange={setSearch}
              onDelete={handleDelete}
            />
          </>
        )}
        {page === 'delete' && (
          <DeleteSection
            suppliers={filteredSuppliers}
            search={search}
            onSearchChange={setSearch}
            onDelete={handleDelete}
          />
        )}
        {page === 'history' && (
          <HistorySection
            suppliers={suppliers}
            onToggleStatus={handleToggleStatus}
          />
        )}
        {page === 'outstanding' && <OutstandingSection suppliers={suppliers} />}
        {page === 'ledger' && <LedgerSection suppliers={suppliers} />}
      </div>
    </div>
  );
}

export default App;
