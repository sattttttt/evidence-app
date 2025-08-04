import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StoDetailPage from './pages/StoDetailPage';
import LopDetailPage from './pages/LopDetailPage';
import EvidencePage from './pages/EvidencePage';
import Header from './components/Header';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  // currentUser bisa jadi null (jika sudah dicek & tidak login)
  // atau undefined (jika masih proses pengecekan awal)
  if (currentUser === undefined) {
    return <div className="loading-screen">Memuat Aplikasi...</div>;
  }

  return (
    <>
      {currentUser && <Header />}
      <Routes>
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={currentUser ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/sto/:stoId" element={currentUser ? <StoDetailPage /> : <Navigate to="/login" />} />
        <Route path="/sto/:stoId/mitra/:mitraId" element={currentUser ? <LopDetailPage /> : <Navigate to="/login" />} />
        <Route path="/sto/:stoId/mitra/:mitraId/lop/:lopId" element={currentUser ? <EvidencePage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} />} />
      </Routes>
    </>
  );
}

export default App;