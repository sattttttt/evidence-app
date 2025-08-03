import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LopTable from '../components/LopTable';
import EmptyState from '../components/EmptyState';
import { CgFileDocument } from 'react-icons/cg';

function LopDetailPage({ allStoData }) {
  const { stoId, mitraId } = useParams();
  const selectedSto = allStoData.find(sto => sto.id === stoId);
  const selectedMitra = selectedSto?.mitra.find(m => m.id === mitraId);

  if (!selectedMitra) {
    return (
      <div className="page-container">
        <h1>Data Mitra Tidak Ditemukan</h1>
        <Link to="/dashboard">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Daftar LOP - Mitra {selectedMitra.name} (STO: {selectedSto.name})</h1>
      
      {selectedMitra.lops.length > 0 ? (
        <LopTable lops={selectedMitra.lops} stoId={stoId} mitraId={mitraId} />
      ) : (
        <EmptyState 
          icon={<CgFileDocument />}
          message="Tidak ada LOP yang terdaftar untuk mitra ini."
        />
      )}

      <Link to={`/sto/${stoId}`} style={{ marginTop: '20px' }}>
        Kembali ke Daftar Mitra
      </Link>
    </div>
  );
}

export default LopDetailPage;