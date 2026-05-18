import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://deltaplus-delivery-schedule-backend.onrender.com/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      alert("Welcome " + res.data.user.name);
      navigate("/order");
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <div className="login-container">
      <div className="login-container-bg"></div>
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src="/deltaplus.png" alt="DeltaPlus" className="login-logo" />
          </div>
          <div className="header-badge">
            <span>Welcome Back</span>
          </div>
          <h2>Sign In to Your Account</h2>
          <p>Access your dashboard and manage your workflow</p>
        </div>

        <div className="login-form">
          <div className="input-group">
            <label>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyPress={handleKeyPress}
              className="login-input"
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyPress={handleKeyPress}
              className="login-input"
            />
          </div>

          <button 
            onClick={submit} 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register" className="register-link">Register here</Link>
            </p>
          </div>
        </div>

        <div className="login-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;