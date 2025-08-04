import React from 'react';
import './PhotoItem.css';

// Tambahkan prop onPhotoClick
function PhotoItem({ imageUrl, altText, onDelete, onPhotoClick }) {
  return (
    <div className="photo-item-container" onClick={onPhotoClick}>
      <img src={imageUrl} alt={altText} />
      {/* Tombol hapus tetap sama */}
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="delete-button">×</button>
    </div>
  );
}

export default PhotoItem;