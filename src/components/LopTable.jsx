import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LopTable.css';

function LopTable({ lops, stoId, mitraId, onUpdateStatus }) {
  const { currentUser } = useAuth();

  // Fungsi untuk mendapatkan style kelas berdasarkan status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending Review': return 'status-pending';
      case 'Needs Revision': return 'status-revision';
      case 'Completed': return 'status-completed';
      default: return 'status-progress';
    }
  };

  return (
    <div className="lop-table-container">
      <table className="lop-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama LOP</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {lops.map((lop, index) => (
            <tr key={lop.firestoreId}>
              <td>{index + 1}</td>
              <td>{lop.name}</td>
              <td>
                <span className={`status-badge ${getStatusClass(lop.status)}`}>
                  {lop.status || 'In Progress'}
                </span>
              </td>
              <td className="action-cell">
                {/* Aksi untuk Waspang */}
                {currentUser?.role === 'Waspang' && (lop.status === 'In Progress' || lop.status === 'Needs Revision') && (
                  <button onClick={() => onUpdateStatus(lop.firestoreId, 'Pending Review')} className="action-button submit">
                    Submit Review
                  </button>
                )}

                {/* Aksi untuk Staff Admin */}
                {currentUser?.role === 'Staff Admin' && lop.status === 'Pending Review' && (
                  <>
                    <button onClick={() => onUpdateStatus(lop.firestoreId, 'Completed')} className="action-button approve">Approve</button>
                    <button onClick={() => onUpdateStatus(lop.firestoreId, 'Needs Revision')} className="action-button reject">Reject</button>
                  </>
                )}

                {/* Tombol Open tetap ada untuk semua */}
                <Link to={`/sto/${stoId}/mitra/${mitraId}/lop/${lop.id}`} className="action-button open">
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LopTable;