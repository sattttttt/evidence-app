import React from 'react';
import { Link } from 'react-router-dom'; // 1. Impor Link
import './LopTable.css';

// 2. Terima stoId dan mitraId sebagai props
function LopTable({ lops, stoId, mitraId }) {
  return (
    <div className="lop-table-container">
      <table className="lop-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama LOP</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {lops.map((lop, index) => (
            <tr key={lop.id}>
              <td>{index + 1}</td>
              <td>{lop.name}</td>
              <td>
                {/* 3. Ubah button menjadi Link */}
                <Link 
                  to={`/sto/${stoId}/mitra/${mitraId}/lop/${lop.id}`}
                  className="action-button"
                >
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