import React from 'react';
import './SkeletonLoader.css';

// Komponen kerangka untuk kartu
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line title"></div>
      <div className="skeleton-line text"></div>
    </div>
  );
}

// Komponen kerangka untuk tabel
export function SkeletonTable() {
  return (
    <div className="skeleton-table-container">
      <div className="skeleton-line th"></div>
      <div className="skeleton-line tr"></div>
      <div className="skeleton-line tr"></div>
      <div className="skeleton-line tr"></div>
    </div>
  );
}