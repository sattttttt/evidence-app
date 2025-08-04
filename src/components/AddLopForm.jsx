import React, { useState } from 'react';
import './AddLopForm.css';

function AddLopForm({ onSubmit, onCancel }) {
  const [lopId, setLopId] = useState('');
  const [lopName, setLopName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!lopId || !lopName) {
      alert("ID LOP dan Nama LOP tidak boleh kosong.");
      return;
    }
    // Kirim data sebagai objek dengan field 'id' dan 'name'
    onSubmit({ id: lopId, name: lopName });
  };

  return (
    <form className="add-lop-form" onSubmit={handleSubmit}>
      <h3>Tambah LOP Baru</h3>
      <div className="form-group">
        <label htmlFor="lopId">ID LOP (cth: LOP-001)</label>
        <input 
          type="text" 
          id="lopId"
          value={lopId}
          onChange={(e) => setLopId(e.target.value)}
          placeholder="Masukkan ID unik LOP"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lopName">Nama LOP (cth: JPP-PT3-...)</label>
        <input 
          type="text" 
          id="lopName"
          value={lopName}
          onChange={(e) => setLopName(e.target.value)}
          placeholder="Masukkan nama deskriptif LOP"
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">Batal</button>
        <button type="submit" className="submit-button">Simpan</button>
      </div>
    </form>
  );
}

export default AddLopForm;