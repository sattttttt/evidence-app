import React from 'react';
import { IoLogOutOutline } from 'react-icons/io5'; // 1. Impor ikon
import './Header.css';

function Header({ onLogout }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h2 className="app-title">Evidence Management</h2>
        {/* 2. Tambahkan ikon di dalam tombol */}
        <button onClick={onLogout} className="logout-button">
          <IoLogOutOutline /> 
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;