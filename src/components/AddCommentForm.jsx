import React, { useState } from 'react';
import './AddCommentForm.css';

function AddCommentForm({ onSubmit, isSubmitting }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onSubmit(commentText);
    setCommentText(''); // Kosongkan form setelah submit
  };

  return (
    <form className="add-comment-form" onSubmit={handleSubmit}>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Tulis komentar Anda di sini..."
        required
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Kirim'}
      </button>
    </form>
  );
}

export default AddCommentForm;