import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import StoCard from '../components/StoCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import './DashboardPage.css';

function DashboardPage() {
  const [stoList, setStoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStos = async () => {
      setIsLoading(true);
      try {
        const stoCollectionRef = collection(db, 'sto');
        const stoQuery = query(stoCollectionRef);
        const querySnapshot = await getDocs(stoQuery);
        
        const stos = querySnapshot.docs.map(doc => ({
          firestoreId: doc.id, 
          ...doc.data()
        }));

        setStoList(stos);
      } catch (error) {
        console.error("Gagal mengambil data STO:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Menambahkan sedikit delay agar skeleton terlihat saat data cepat dimuat
    const timer = setTimeout(() => {
        fetchStos();
    }, 500); // delay 0.5 detik

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

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
        {isLoading ? (
          // Tampilkan 8 kerangka kartu saat loading
          Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          // Tampilkan data asli jika sudah selesai
          filteredStoList.map((sto) => (
            <StoCard
              key={sto.firestoreId}
              id={sto.id}
              name={sto.name}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;