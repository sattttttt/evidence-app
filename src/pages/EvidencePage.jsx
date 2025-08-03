import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import PhotoItem from '../components/PhotoItem';
import EmptyState from '../components/EmptyState';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { ImImages } from 'react-icons/im';
import './EvidencePage.css';

// Data awal/template untuk struktur evidence (sepenuhnya kosong)
const initialEvidenceData = {
  'Evidence Barang Tiba': [],
  'Dokumentasi CT/UT': [],
  'Evidence Roll Meter': [],
  'Evidence Pengukuran OPM': [],
  'Dokumentasi Pekerjaan': [],
  'Evidence Material Terpasang': {
    'ODP': [],
    'Tiang Baru': [],
    'Label Tiang Baru': [],
    'Closure': [],
    'Pipa PVC + Klem': [],
    'Aksesoris Tiang': [],
  },
};

function EvidencePage({ allStoData }) {
  const { stoId, mitraId, lopId } = useParams();

  // State utama untuk semua data evidence, diambil dari localStorage atau data awal
  const [evidenceData, setEvidenceData] = useState(() => {
    try {
      const savedData = localStorage.getItem(lopId);
      return savedData ? JSON.parse(savedData) : initialEvidenceData;
    } catch (error) {
      console.error("Gagal memuat data dari localStorage", error);
      return initialEvidenceData;
    }
  });
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // Menyimpan ke localStorage setiap kali evidenceData berubah
  useEffect(() => {
    try {
      localStorage.setItem(lopId, JSON.stringify(evidenceData));
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage", error);
    }
  }, [evidenceData, lopId]);

  const selectedSto = allStoData.find(sto => sto.id === stoId);
  const selectedMitra = selectedSto?.mitra.find(m => m.id === mitraId);
  const selectedLop = selectedMitra?.lops.find(l => l.id === lopId);
  
  const evidenceCategories = Object.keys(initialEvidenceData);

  const handleFileUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    const newData = JSON.parse(JSON.stringify(evidenceData));
    if (selectedSubCategory) {
      newData[selectedCategory][selectedSubCategory].push(imageUrl);
    } else {
      newData[selectedCategory].push(imageUrl);
    }
    setEvidenceData(newData);
  };
  
  const handleDeletePhoto = (imageUrlToDelete) => {
    const newData = JSON.parse(JSON.stringify(evidenceData));
    let photoArray;

    if (selectedSubCategory) { photoArray = newData[selectedCategory][selectedSubCategory]; } 
    else { photoArray = newData[selectedCategory]; }

    const updatedPhotoArray = photoArray.filter(url => url !== imageUrlToDelete);

    if (selectedSubCategory) { newData[selectedCategory][selectedSubCategory] = updatedPhotoArray; } 
    else { newData[selectedCategory] = updatedPhotoArray; }
    setEvidenceData(newData);
  };

  const handleCategoryClick = (category) => { setSelectedCategory(category); setSelectedSubCategory(null); };
  const handleSubCategoryClick = (subCategory) => { setSelectedSubCategory(subCategory); };
  const closeGallery = () => { if (selectedSubCategory) { setSelectedSubCategory(null); } else { setSelectedCategory(null); } };
  
  let photosToShow = [];
  let galleryTitle = '';
  if (selectedSubCategory) { photosToShow = evidenceData[selectedCategory]?.[selectedSubCategory] || []; galleryTitle = `${selectedCategory} - ${selectedSubCategory}`; } 
  else if (selectedCategory && Array.isArray(evidenceData[selectedCategory])) { photosToShow = evidenceData[selectedCategory] || []; galleryTitle = selectedCategory; }

  if (!selectedLop) { return <div className="page-container"><h1>Data LOP Tidak Ditemukan</h1></div>; }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link> / 
        <Link to={`/sto/${stoId}`}>{selectedSto?.name}</Link> / 
        <Link to={`/sto/${stoId}/mitra/${mitraId}`}>{selectedMitra?.name}</Link>
      </div>
      <h1>Evidence Untuk: {selectedLop.name}</h1>
      <p>Pilih kategori untuk melihat atau mengunggah bukti.</p>
      
      <div className="evidence-grid">
        {evidenceCategories.map(category => (
          <div key={category} className="evidence-folder" onClick={() => handleCategoryClick(category)}>
            <FaFolder /> {category}
          </div>
        ))}
      </div>
      
      {selectedCategory === 'Evidence Material Terpasang' && !selectedSubCategory && ( 
        <div className="sub-category-viewer"> 
          <h3>Pilih Jenis Material Terpasang:</h3> 
          <div className="evidence-grid">
            {Object.keys(evidenceData['Evidence Material Terpasang']).map(subCat => (
              <div key={subCat} className="evidence-folder" onClick={() => handleSubCategoryClick(subCat)}>
                <FaFolderOpen /> {subCat} ({evidenceData['Evidence Material Terpasang'][subCat].length})
              </div>
            ))}
          </div> 
          <button onClick={closeGallery} className="gallery-header-button">Kembali</button> 
        </div> 
      )}
      
      {((selectedCategory && Array.isArray(evidenceData[selectedCategory])) || selectedSubCategory ) && (
        <div className="photo-gallery">
          <div className="gallery-header">
            <h3>Foto untuk: {galleryTitle}</h3>
            <button onClick={closeGallery} className="gallery-header-button">Tutup</button>
          </div>
          
          {photosToShow.length > 0 ? (
            <div className="photo-grid">
              {photosToShow.map((imageUrl, index) => (
                <PhotoItem 
                  key={index} 
                  imageUrl={imageUrl} 
                  altText={`${galleryTitle} ${index + 1}`} 
                  onDelete={() => handleDeletePhoto(imageUrl)} 
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<ImImages />}
              message="Belum ada foto diunggah untuk kategori ini."
            />
          )}

          <FileUpload onFileSelect={handleFileUpload} />
        </div>
      )}
      
      <Link to={`/sto/${stoId}/mitra/${mitraId}`} style={{ marginTop: '20px' }}>
        Kembali ke Daftar LOP
      </Link>
    </div>
  );
}

export default EvidencePage;