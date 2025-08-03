import React from 'react';
import { Link } from 'react-router-dom';
import './StoCard.css';

// Terima props baru "mitraCount"
function StoCard({ id, name, mitraCount }) {
  return (
    <Link to={`/sto/${id}`} className="sto-card-link">
      <div className="sto-card">
        <h3>{name}</h3>
        {/* Tampilkan jumlah mitra di sini */}
        <p className="mitra-count">{mitraCount} Mitra</p>
      </div>
    </Link>
  );
}

export default StoCard;