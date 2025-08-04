import React from 'react';
import { signOut } from 'firebase/auth';      // 1. Impor fungsi signOut
import { auth } from '../firebaseConfig';      // 2. Impor konfigurasi auth kita
import { IoLogOutOutline } from 'react-icons/io5';
import './Header.css';

// Hapus prop 'onLogout' dari parameter
function Header() {

  // 3. Buat fungsi handleLogout di dalam komponen ini
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Pengguna akan otomatis diarahkan ke halaman login karena
      // AuthContext akan mendeteksi perubahan status autentikasi.
    } catch (error) {
      console.error("Gagal untuk logout:", error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h2 className="app-title">Evidence Management</h2>
        {/* 4. Panggil fungsi handleLogout yang baru kita buat */}
        <button onClick={handleLogout} className="logout-button">
          <IoLogOutOutline /> 
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;