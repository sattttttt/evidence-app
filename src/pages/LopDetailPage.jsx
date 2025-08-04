import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import LopTable from '../components/LopTable';
import EmptyState from '../components/EmptyState';
import LopForm from '../components/AddLopForm'; // Ganti nama import
import { SkeletonTable } from '../components/SkeletonLoader';
import { CgFileDocument } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa';
import './DashboardPage.css';

function LopDetailPage() {
  const { currentUser } = useAuth();
  const { stoId, mitraId } = useParams();
  const [lopList, setLopList] = useState([]);
  const [mitraName, setMitraName] = useState('');
  const [stoName, setStoName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLop, setEditingLop] = useState(null);

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

  const handleAddOrUpdateLop = async (lopData) => {
    setShowForm(false);
    setIsLoading(true);
    try {
      if (editingLop) {
        // Logika Update
        const lopDocRef = doc(db, "lop", editingLop.firestoreId);
        await updateDoc(lopDocRef, { name: lopData.name });
      } else {
        // Logika Add
        const newLop = { id: lopData.id, name: lopData.name, mitraId: mitraId, status: 'In Progress' };
        await addDoc(collection(db, 'lop'), newLop);
      }
      setEditingLop(null);
      await fetchLopsAndNames();
    } catch (error) {
      console.error("Gagal menyimpan data LOP:", error);
      alert("Gagal menyimpan data LOP.");
    }
  };

  const handleEdit = (lop) => {
    setEditingLop(lop);
    setShowForm(true);
  };

  const handleDelete = async (lopFirestoreId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus LOP ini secara permanen?")) {
      try {
        await deleteDoc(doc(db, "lop", lopFirestoreId));
        setLopList(prevList => prevList.filter(lop => lop.firestoreId !== lopFirestoreId));
      } catch (error) {
        console.error("Gagal menghapus LOP:", error);
        alert("Gagal menghapus LOP.");
      }
    }
  };
  
  const handleUpdateStatus = async (lopFirestoreId, newStatus) => {
    const lopDocRef = doc(db, "lop", lopFirestoreId);
    try {
      await updateDoc(lopDocRef, { status: newStatus });
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
        {currentUser?.role === 'Waspang' && !showForm && !isLoading && (
          <button className="add-button" onClick={() => { setShowForm(true); setEditingLop(null); }}>
            <FaPlus /> Tambah LOP
          </button>
        )}
      </div>
      
      {showForm && <LopForm onSubmit={handleAddOrUpdateLop} onCancel={() => { setShowForm(false); setEditingLop(null); }} initialData={editingLop} />}
      
      {lopList.length > 0 ? (
        <LopTable lops={lopList} stoId={stoId} mitraId={mitraId} onUpdateStatus={handleUpdateStatus} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        !showForm && <EmptyState icon={<CgFileDocument />} message="Belum ada LOP untuk mitra ini." />
      )}

      <Link to={`/sto/${stoId}`} style={{ marginTop: '20px' }}>
        Kembali ke Daftar Mitra
      </Link>
    </div>
  );
}

export default LopDetailPage;