import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './DashboardPage.css';

function StoDetailPage({ allStoData }) {
  const { stoId } = useParams();
  const selectedSto = allStoData.find(sto => sto.id === stoId);

  if (!selectedSto) {
    return (
      <div className="page-container">
        <h1>STO Tidak Ditemukan</h1>
        <Link to="/dashboard">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Daftar Mitra di STO: {selectedSto.name}</h1>
      <div className="sto-grid">
        {selectedSto.mitra.map(mitra => (
          <Link key={mitra.id} to={`/sto/${stoId}/mitra/${mitra.id}`} className="card-link">
            <div className="mitra-card">
              <h3>{mitra.name}</h3>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/dashboard" style={{ marginTop: '20px' }}>Kembali ke Dashboard</Link>
    </div>
  );
}

export default StoDetailPage;