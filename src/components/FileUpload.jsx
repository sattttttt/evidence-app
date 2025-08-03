import React, { useRef } from 'react';
import './FileUpload.css';

// Komponen ini menerima fungsi onFileSelect sebagai prop
function FileUpload({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" // Hanya menerima file gambar
      />
      <button onClick={handleClick} className="upload-button">
        + Unggah Bukti Baru
      </button>
    </div>
  );
}

export default FileUpload;