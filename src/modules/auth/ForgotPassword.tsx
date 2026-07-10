import { useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const usingSupabase = Boolean(supabase);

  const handleReset = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    // Supabase sends a secure reset link by email; the new password is set on
    // the /update-password page after the user clicks that link.
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("If an account exists for this email, a password reset link has been sent. Please check your inbox.");
      setEmail("");
      navigate("/login");
      return;
    }

    // localStorage fallback (used until Supabase env vars are set).
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userIndex = registeredUsers.findIndex(
      (user: { email: string }) => user.email === email.trim()
    );

    if (userIndex === -1) {
      alert("No account found with this email");
      return;
    }

    registeredUsers[userIndex].password = newPassword;
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    alert("Password changed successfully. You can now log in with the new password.");
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    navigate("/login");
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
        <h2>Forgot Password</h2>

        <p>
          {usingSupabase
            ? "Enter your email and we'll send you a reset link"
            : "Enter your email and choose a new password"}
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {!usingSupabase && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </>
        )}

        <button onClick={handleReset} style={styles.button}>
          {usingSupabase ? "Send Reset Link" : "Reset Password"}
        </button>

        <p style={{ marginTop: "15px" }}>
          <Link to="/login">Back to Login</Link>
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
    background: "#f5f5f5",
  },

  box: {
    width: "350px",
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "15px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ForgotPassword;
