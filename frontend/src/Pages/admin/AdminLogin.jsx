import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../ngo/Login.css"; 
import { setCookie } from "../../../utils/cookieUtils";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    const adminData = { username, password };

    axios
      .post(`${import.meta.env.VITE_APP_API_BASE_URL}/admin_verify`, adminData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setCookie("adminSession", JSON.stringify({ username }), 1);
        navigate("/admin/dashboard");
      })
      .catch(() => {
        setError("Invalid username or password.");
      });
  };

  return (
    <div className="login-frame-wrapper">
      <div className="login-wrapper">
        <div className="login-left admin">
          <div className="logo-container">
            <img src="/logo.png" alt="ResQConnect Logo" className="logo" />
          </div>
          <h1>Admin Portal</h1>
          <p>
            Manage disaster channels, users, and NGOs. Secure and centralized control for administrators.
          </p>
        </div>
        <div className="login-right">
          <form className="login-form admin" onSubmit={handleSubmit}>
            <h2>Admin Login</h2>
            <p>Login to access the admin dashboard and manage the platform.</p>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">LOGIN</button>
            {error && <div className="admin-error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
