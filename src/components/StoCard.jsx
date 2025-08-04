import React from 'react';
import { Link } from 'react-router-dom';
import './StoCard.css';

// Hapus prop mitraCount untuk sementara
function StoCard({ id, name }) {
  return (
    <Link to={`/sto/${id}`} className="sto-card-link">
      <div className="sto-card">
        <h3>{name}</h3>
        <p className="mitra-count">Lihat Detail</p>
      </div>
    </Link>
  );
}

export default StoCard;