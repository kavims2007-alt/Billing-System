import { useState, type CSSProperties, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type User = {
  fullName: string;
  email: string;
  password: string;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }

    // Supabase-backed login when configured.
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      navigate("/dashboard");
      return;
    }

    // localStorage fallback (used until Supabase env vars are set).
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]") as User[];
    const matchedUser = registeredUsers.find(
      (user: User) => user.email === email.trim() && user.password === password
    );

    if (!matchedUser) {
      alert("Invalid email or password");
      return;
    }

    const userData = {
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      loggedIn: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    refresh();
    alert("Login successful");
    navigate("/dashboard");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-3 text-primary">
            BillingPro
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
      <div style={styles.box}>
        <h2>Billing Software</h2>
        <h3>User Login</h3>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p>
          Don't have an account? {" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
      </div>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f4f4",
  },
  box: {
    width: "350px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login;