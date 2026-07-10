import { useEffect, useState } from "react";

type PageType = "dashboard" | "create-invoice" | "invoice-history" | "customers" | "products" | "settings";

interface Customer {
  customerName: string;
  phoneNumber: string;
  address: string;
}

function Customers({ setCurrentPage: _setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  return (
    <>
      <h2>Customers</h2>

      {customers.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customerName}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info mt-3">No customers saved yet.</div>
      )}
    </>
  );
}

export default Customers;
