import React, { useState } from 'react';
import StoCard from '../components/StoCard';
import './DashboardPage.css';

function DashboardPage({ stoList }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStoList = stoList.filter(sto =>
    sto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Dashboard STO Area Yogyakarta</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari STO berdasarkan nama..."
          className="search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      
      <div className="sto-grid">
        {filteredStoList.map((sto) => (
          <StoCard
            key={sto.id}
            id={sto.id}
            name={sto.name}
            mitraCount={sto.mitra.length}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;