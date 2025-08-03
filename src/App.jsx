import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StoDetailPage from './pages/StoDetailPage';
import LopDetailPage from './pages/LopDetailPage';
import EvidencePage from './pages/EvidencePage';
import Header from './components/Header';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- DATA DUMMY DIPERBARUI DI SINI ---
  const mitra_gmj = { id: 'MTR-GMJ', name: 'GMJ', lops: [{id: 'LOP-001', name: 'JPP-PT3-25-WTS-FCG-SELING'}]};
  const mitra_famika = { id: 'MTR-FKA', name: 'FAMIKA', lops: [{id: 'LOP-003', name: 'JPP-PT3-25-BTL-FAE-TEGAL'}]};
  const mitra_icc = { id: 'MTR-ICC', name: 'ICC', lops: [{id: 'LOP-004', name: 'JPP-PT3-25-SLM-FDE-SENDANG'}]};
  const mitra_apra = { id: 'MTR-APR', name: 'APRA', lops: [] };
  const mitra_bistel = { id: 'MTR-BST', name: 'BISTEL', lops: [{id: 'LOP-006', name: 'JPP-PT3-25-BBS-FF-SUMIYATI'}]};

  const stoData = [
    { id: 'STO-WTS', name: 'Wates', mitra: [mitra_gmj, mitra_famika] }, // 2 Mitra
    { id: 'STO-GDN', name: 'Godean', mitra: [mitra_icc] }, // 1 Mitra
    { id: 'STO-SLM', name: 'Sleman', mitra: [mitra_apra, mitra_bistel, mitra_gmj, mitra_icc] }, // 4 Mitra
    { id: 'STO-WNS', name: 'Wonosari', mitra: [mitra_gmj, mitra_bistel] }, // 2 Mitra
    { id: 'STO-PGR', name: 'Pugeran', mitra: [mitra_famika, mitra_icc, mitra_apra] }, // 3 Mitra
    { id: 'STO-BTL', name: 'Bantul', mitra: [mitra_bistel] }, // 1 Mitra
    // Hapus STO lain agar tidak terlalu banyak di layar
  ];

  const handleLoginSuccess = () => { setIsLoggedIn(true); };
  const handleLogout = () => { setIsLoggedIn(false); };

  return (
    <>
      {isLoggedIn && <Header onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={isLoggedIn ? <DashboardPage stoList={stoData} /> : <Navigate to="/login" />} />
        <Route path="/sto/:stoId" element={isLoggedIn ? <StoDetailPage allStoData={stoData} /> : <Navigate to="/login" />} />
        <Route path="/sto/:stoId/mitra/:mitraId" element={isLoggedIn ? <LopDetailPage allStoData={stoData} /> : <Navigate to="/login" />} />
        <Route path="/sto/:stoId/mitra/:mitraId/lop/:lopId" element={isLoggedIn ? <EvidencePage allStoData={stoData} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} />} />
      </Routes>
    </>
  );
}

export default App;