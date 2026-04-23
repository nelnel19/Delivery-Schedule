import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-area">
          <img src="/deltaplus.png" alt="DeltaPlus Logo" className="logo-image" />
          <div className="logo-text">
            <h1>DeltaPlus</h1>
            <span>Delivery Schedule System</span>
          </div>
        </div>
        
        <nav className="nav-menu">
          <Link to="/order" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16M4 12h16" />
            </svg>
            <span>Create Order</span>
          </Link>
          <Link to="/orders" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7L9 18L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>My Orders</span>
          </Link>
        </nav>
        
        <button onClick={handleLogout} className="logout-btn">
          <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M16 7V4a2 2 0 0 0-2-2h-4" />
            <path d="M12 12h8" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;