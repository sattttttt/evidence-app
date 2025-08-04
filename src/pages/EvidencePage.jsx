import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import PhotoItem from '../components/PhotoItem';
import EmptyState from '../components/EmptyState';
import AddCommentForm from '../components/AddCommentForm';
import CommentList from '../components/CommentList';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { ImImages } from 'react-icons/im';
import './EvidencePage.css';
import './DetailPage.css';

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

function EvidencePage() {
  const { currentUser } = useAuth();
  const { stoId, mitraId, lopId } = useParams();
  
  const [lopName, setLopName] = useState('');
  const [mitraName, setMitraName] = useState('');
  const [stoName, setStoName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
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
  
  const fetchPageData = useCallback(async () => {
    if (!lopId) return;
    setIsLoading(true);
    try {
      const namePromises = [
        getDocs(query(collection(db, 'lop'), where("id", "==", lopId))),
        getDocs(query(collection(db, 'mitra'), where("id", "==", mitraId))),
        getDocs(query(collection(db, 'sto'), where("id", "==", stoId))),
      ];
      const commentPromise = getDocs(query(collection(db, "comments"), where("lopId", "==", lopId), orderBy("timestamp", "asc")));
      
      const [lopSnapshot, mitraSnapshot, stoSnapshot, commentSnapshot] = await Promise.all([
        ...namePromises,
        commentPromise
      ]);

      if (!lopSnapshot.empty) setLopName(lopSnapshot.docs[0].data().name);
      if (!mitraSnapshot.empty) setMitraName(mitraSnapshot.docs[0].data().name);
      if (!stoSnapshot.empty) setStoName(stoSnapshot.docs[0].data().name);
      
      const fetchedComments = commentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);

    } catch (error) {
      console.error("Gagal mengambil data halaman:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lopId, mitraId, stoId]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);
  
  useEffect(() => {
    try {
      localStorage.setItem(lopId, JSON.stringify(evidenceData));
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage", error);
    }
  }, [evidenceData, lopId]);

  const handleAddComment = async (commentText) => {
    if (!currentUser) return alert("Anda harus login untuk berkomentar.");
    setIsSubmittingComment(true);
    try {
      const newComment = {
        lopId: lopId, text: commentText, authorId: currentUser.uid,
        authorName: currentUser.name || currentUser.email, timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "comments"), newComment);
      await fetchPageData(); // Ambil ulang semua data untuk konsistensi
    } catch (error) {
      console.error("Gagal menambah komentar:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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

  if (isLoading) { return <div className="page-container"><h1>Memuat Data...</h1></div>; }

  return (
    <div className="page-container">
      <div className="detail-content-wrapper">
        <div className="breadcrumb" style={{ width: '100%' }}>
          <Link to="/dashboard">Dashboard</Link> / 
          <Link to={`/sto/${stoId}`}>{stoName}</Link> / 
          <Link to={`/sto/${stoId}/mitra/${mitraId}`}>{mitraName}</Link>
        </div>
        <h1>Evidence Untuk: {lopName}</h1>
        <p>Pilih kategori untuk melihat atau mengunggah evidence yang diperlukan.</p>
        
        <div className="evidence-grid">
          {Object.keys(initialEvidenceData).map(category => (
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

            <div className="comment-section">
              <CommentList comments={comments} />
              {currentUser && currentUser.role === 'Staff Admin' && (
                <AddCommentForm onSubmit={handleAddComment} isSubmitting={isSubmittingComment} />
              )}
            </div>
          </div>
        )}
        
        <Link to={`/sto/${stoId}/mitra/${mitraId}`} style={{ alignSelf: 'flex-start', marginTop: '20px' }}>
          Kembali ke Daftar LOP
        </Link>
      </div>
    </div>
  );
}

export default EvidencePage;