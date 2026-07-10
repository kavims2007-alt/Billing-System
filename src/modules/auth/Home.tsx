import { Link, useLocation } from "react-router-dom";
import billingImage from "../../assets/billing.png";
function Home() {
  const location = useLocation();
  
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <a className="navbar-brand fw-bold fs-3 text-primary" href="/">
            BillingPro
          </a>

          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Features</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">Contact</a>
              </li>
            </ul>

            <Link to="/login" className="btn btn-outline-primary me-2">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}

      <section className="container py-5">

        <div className="row align-items-center">

          <div className="col-lg-6">

            <span className="badge bg-success fs-6 mb-3">
              100% Secure Billing
            </span>

            <h1 className="display-3 fw-bold">
              Smart Billing Software
            </h1>

            <p className="lead text-secondary mt-4">
              Manage Customers, Products, Billing,
              Sales Reports and Inventory with one software.
            </p>

            <div className="mt-4">

              <Link
                to="/register"
                className="btn btn-primary btn-lg me-3"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="btn btn-outline-dark btn-lg"
              >
                Login
              </Link>

            </div>

            <div className="mt-5">

              <h3 className="fw-bold">
                Trusted by 10,000+ Businesses
              </h3>

            </div>

          </div>

          <div className="col-lg-6 text-center">

            <img
              src={billingImage}
              className="img-fluid rounded-4 shadow"
              alt="Billing Software"
            />

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="container py-5">

        <div className="row text-center">

          <div className="col-md-3">

            <div className="card shadow border-0 p-4">

              <h4>Customers</h4>

              <p>
                Manage customer details
              </p>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card shadow border-0 p-4">

              <h4>Products</h4>

              <p>
                Product inventory
              </p>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card shadow border-0 p-4">

              <h4>Invoices</h4>

              <p>
                Generate bills instantly
              </p>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card shadow border-0 p-4">

              <h4>Reports</h4>

              <p>
                Daily & Monthly Reports
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="bg-dark text-white text-center py-4 mt-5">

        © 2026 BillingPro Software | All Rights Reserved

      </footer>
    </>
  );
}

export default Home;