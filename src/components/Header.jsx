import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>Order Management System</h2>
        </div>
        
        <nav className="nav-menu">
          <Link to="/order" className="nav-link">Create Order</Link>
          <Link to="/orders" className="nav-link">My Orders</Link>
        </nav>
        
        <div className="user-info">
          {user && <span className="user-name">Welcome, {user.name}</span>}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;