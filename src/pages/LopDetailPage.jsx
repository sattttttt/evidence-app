import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import LopTable from '../components/LopTable';
import EmptyState from '../components/EmptyState';
import AddLopForm from '../components/AddLopForm';
import { SkeletonTable } from '../components/SkeletonLoader';
import { CgFileDocument } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa';

function LopDetailPage() {
  const { currentUser } = useAuth();
  const { stoId, mitraId } = useParams();
  const [lopList, setLopList] = useState([]);
  const [mitraName, setMitraName] = useState('');
  const [stoName, setStoName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchLopsAndNames = useCallback(async () => {
    if (!mitraId || !stoId) return;
    setIsLoading(true);
    try {
      const lopPromise = getDocs(query(collection(db, 'lop'), where("mitraId", "==", mitraId)));
      const mitraPromise = getDocs(query(collection(db, 'mitra'), where("id", "==", mitraId)));
      const stoPromise = getDocs(query(collection(db, 'sto'), where("id", "==", stoId)));

      const [lopSnapshot, mitraSnapshot, stoSnapshot] = await Promise.all([lopPromise, mitraPromise, stoPromise]);

      const lops = lopSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
      setLopList(lops);

      if (!mitraSnapshot.empty) setMitraName(mitraSnapshot.docs[0].data().name);
      if (!stoSnapshot.empty) setStoName(stoSnapshot.docs[0].data().name);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [mitraId, stoId]);

  useEffect(() => {
    fetchLopsAndNames();
  }, [fetchLopsAndNames]);

  const handleAddLop = async (lopData) => {
    setShowAddForm(false);
    setIsLoading(true);
    try {
      const newLop = {
        id: lopData.id,
        name: lopData.name,
        mitraId: mitraId,
        status: 'In Progress'
      };
      await addDoc(collection(db, 'lop'), newLop);
      await fetchLopsAndNames();
    } catch (error) {
      console.error("Gagal menambahkan LOP baru:", error);
      alert("Gagal menambahkan LOP baru.");
    }
  };
  
  const handleUpdateStatus = async (lopFirestoreId, newStatus) => {
    const lopDocRef = doc(db, "lop", lopFirestoreId);
    try {
      await updateDoc(lopDocRef, {
        status: newStatus
      });
      // Perbarui tampilan secara manual agar terasa instan
      setLopList(prevList =>
        prevList.map(lop =>
          lop.firestoreId === lopFirestoreId ? { ...lop, status: newStatus } : lop
        )
      );
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal memperbarui status LOP.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header"><h1>Daftar LOP - Mitra ... (STO: ...)</h1></div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Daftar LOP - Mitra {mitraName} (STO: {stoName})</h1>
        {currentUser?.role === 'Waspang' && !showAddForm && !isLoading && (
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            <FaPlus /> Tambah LOP
          </button>
        )}
      </div>

      {showAddForm && <AddLopForm onSubmit={handleAddLop} onCancel={() => setShowAddForm(false)} />}

      {lopList.length > 0 ? (
        <LopTable lops={lopList} stoId={stoId} mitraId={mitraId} onUpdateStatus={handleUpdateStatus} />
      ) : (
        !showAddForm && <EmptyState icon={<CgFileDocument />} message="Belum ada LOP untuk mitra ini." />
      )}

      <Link to={`/sto/${stoId}`} style={{ marginTop: '20px' }}>
        Kembali ke Daftar Mitra
      </Link>
    </div>
  );
}

export default LopDetailPage;