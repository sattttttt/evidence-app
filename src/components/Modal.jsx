import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonLoader'; // Impor SkeletonCard
import { FaUsers } from 'react-icons/fa';
import './DashboardPage.css';

function StoDetailPage() {
  const { stoId } = useParams();
  const [mitraList, setMitraList] = useState([]);
  const [stoName, setStoName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMitra = useCallback(async () => {
    if (!stoId) return;
    setIsLoading(true);
    try {
      // Ambil data mitra berdasarkan STO
      const mitraQuery = query(collection(db, 'mitra'), where("stoIds", "array-contains", stoId));
      const mitraSnapshot = await getDocs(mitraQuery);
      const mitras = mitraSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
      setMitraList(mitras);

      // Ambil nama STO untuk judul
      const stoQuery = query(collection(db, 'sto'), where("id", "==", stoId));
      const stoSnapshot = await getDocs(stoQuery);
      if (!stoSnapshot.empty) {
        setStoName(stoSnapshot.docs[0].data().name);
      }
    } catch (error) {
      console.error("Gagal mengambil data Mitra:", error);
    } finally {
      setIsLoading(false);
    }
  }, [stoId]);

  useEffect(() => {
    fetchMitra();
  }, [fetchMitra]);

  return (
    <div className="page-container">
      <h1>Daftar Mitra di STO: {stoName || '...'}</h1>

      {isLoading ? (
        // Tampilkan kerangka kartu saat loading
        <div className="sto-grid">
          {Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : mitraList.length > 0 ? (
        // Tampilkan data asli jika sudah selesai
        <div className="sto-grid">
          {mitraList.map(mitra => (
            <Link key={mitra.firestoreId} to={`/sto/${stoId}/mitra/${mitra.id}`} className="card-link">
              <div className="mitra-card">
                <h3>{mitra.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Tampilkan pesan kosong jika tidak ada data
        <EmptyState
          icon={<FaUsers />}
          message="Belum ada mitra yang terdaftar untuk STO ini."
        />
      )}
      <Link to="/dashboard" style={{ marginTop: '20px' }}>Kembali ke Dashboard</Link>
    </div>
  );
}

export default StoDetailPage;