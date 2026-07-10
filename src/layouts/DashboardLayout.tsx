import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./layout.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
  { to: "/suppliers", label: "Suppliers", icon: "fa-solid fa-truck-field" },
  { to: "/inventory", label: "Inventory", icon: "fa-solid fa-boxes-stacked" },
  { to: "/invoice", label: "Invoice", icon: "fa-solid fa-file-invoice" },
  { to: "/purchase", label: "Purchase", icon: "fa-solid fa-cart-shopping" },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar-brand">
          Billing<span className="brand-accent">Pro</span>
        </div>

        <ul className="app-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === "/dashboard"}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <strong>Billing Software</strong>
          <div className="topbar-user">
            <span>
              <i className="fa-solid fa-user-circle me-2"></i>
              {user?.fullName || user?.email || "User"}
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket me-1"></i>
              Logout
            </button>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
