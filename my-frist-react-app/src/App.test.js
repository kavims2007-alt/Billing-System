import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard header', () => {
  render(<App />);
  const headingElement = screen.getByText(/Vendor\/Supplier Management Dashboard/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders add supplier action button', () => {
  render(<App />);
  const addButton = screen.getByRole('button', { name: /Add Supplier/i });
  expect(addButton).toBeInTheDocument();
});

test('renders recent transactions table', () => {
  render(<App />);
  const transactionsHeading = screen.getByText(/Recent Transactions/i);
  const supplierColumn = screen.getByRole('columnheader', { name: /Supplier/i });
  expect(transactionsHeading).toBeInTheDocument();
  expect(supplierColumn).toBeInTheDocument();
});

test('navigates to add supplier form when dashboard action clicked', () => {
  render(<App />);
  const dashboardAddButton = screen.getByRole('button', { name: /Add Supplier/i });
  fireEvent.click(dashboardAddButton);

  const formSectionHeading = screen.getByRole('heading', { level: 3, name: /Add Supplier/i });
  const nameField = screen.getByLabelText(/Supplier Name/i);
  const invoiceField = screen.getByLabelText(/Invoice/i);
  const amountField = screen.getByLabelText(/Amount/i);

  expect(formSectionHeading).toBeInTheDocument();
  expect(nameField).toBeInTheDocument();
  expect(invoiceField).toBeInTheDocument();
  expect(amountField).toBeInTheDocument();
});

test('submits add supplier form and shows new supplier in list', () => {
  render(<App />);
  const dashboardAddButton = screen.getByRole('button', { name: /Add Supplier/i });
  fireEvent.click(dashboardAddButton);

  const nameField = screen.getByLabelText(/Supplier Name/i);
  const invoiceField = screen.getByLabelText(/Invoice/i);
  const amountField = screen.getByLabelText(/Amount/i);
  const addSupplierSubmit = screen.getByRole('button', { name: /^Add Supplier$/i });

  fireEvent.change(nameField, { target: { value: 'New Supplier Co' } });
  fireEvent.change(invoiceField, { target: { value: 'INV999' } });
  fireEvent.change(amountField, { target: { value: '35000' } });
  fireEvent.click(addSupplierSubmit);

  const supplierListHeading = screen.getByRole('heading', { level: 3, name: /Supplier List/i });
  const newSupplierName = screen.getByText(/New Supplier Co/i);
  const newInvoice = screen.getByText(/INV999/i);
  const newAmount = screen.getByText(/₹35,000/i);

  expect(supplierListHeading).toBeInTheDocument();
  expect(newSupplierName).toBeInTheDocument();
  expect(newInvoice).toBeInTheDocument();
  expect(newAmount).toBeInTheDocument();
});
