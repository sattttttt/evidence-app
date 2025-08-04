import React, { useState, useEffect } from 'react';
import './AddLopForm.css';

// Form ini sekarang menerima initialData
function LopForm({ onSubmit, onCancel, initialData }) {
  const [lopId, setLopId] = useState('');
  const [lopName, setLopName] = useState('');

  // useEffect untuk mengisi form jika dalam mode edit
  useEffect(() => {
    if (initialData) {
      setLopId(initialData.id || '');
      setLopName(initialData.name || '');
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!lopId || !lopName) {
      alert("ID LOP dan Nama LOP tidak boleh kosong.");
      return;
    }
    onSubmit({ id: lopId, name: lopName });
  };

  return (
    <form className="lop-form" onSubmit={handleSubmit}>
      {/* Judul berubah sesuai mode */}
      <h3>{initialData ? 'Edit LOP' : 'Tambah LOP Baru'}</h3>
      <div className="form-group">
        <label htmlFor="lopId">IHLD LOP</label>
        <input 
          type="text" 
          id="lopId"
          value={lopId}
          onChange={(e) => setLopId(e.target.value)}
          placeholder="Masukkan IHLD LOP"
          required
          // ID tidak bisa diubah saat mode edit
          disabled={!!initialData}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lopName">Nama LOP</label>
        <input 
          type="text" 
          id="lopName"
          value={lopName}
          onChange={(e) => setLopName(e.target.value)}
          placeholder="Masukkan nama LOP"
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">Batal</button>
        {/* Teks tombol berubah sesuai mode */}
        <button type="submit" className="submit-button">
          {initialData ? 'Update' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}

export default LopForm;