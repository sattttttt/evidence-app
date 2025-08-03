import React from 'react';
import './PhotoItem.css';

// Komponen ini sekarang menerima fungsi onDelete
function PhotoItem({ imageUrl, altText, onDelete }) {
  return (
    <div className="photo-item-container">
      <img src={imageUrl} alt={altText} />
      {/* Tambahkan tombol hapus di sini */}
      <button onClick={onDelete} className="delete-button">×</button>
    </div>
  );
}

export default PhotoItem;