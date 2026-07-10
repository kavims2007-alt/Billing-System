import { useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Landing page for the Supabase password-reset email link. supabase-js parses
// the recovery token from the URL on load and establishes a temporary session,
// so updateUser({ password }) here sets the new password.
function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (!supabase) {
      alert("Password reset links require Supabase to be configured.");
      navigate("/login");
      return;
    }

    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully. Please log in with your new password.");
    await supabase.auth.signOut();
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
          <h2>Set New Password</h2>
          <p>Choose a new password for your account</p>

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

          <button onClick={handleUpdate} style={styles.button}>
            Update Password
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

export default UpdatePassword;
