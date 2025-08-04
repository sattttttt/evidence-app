import React from 'react';
import './CommentList.css';

function CommentList({ comments }) {
  return (
    <div className="comment-list">
      <h4>Komentar:</h4>
      {comments.length === 0 ? (
        <p className="no-comments">Belum ada komentar.</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <p className="comment-author">
              <strong>{comment.authorName}</strong>
              <span className="comment-timestamp">
                {new Date(comment.timestamp?.toDate()).toLocaleString()}
              </span>
            </p>
            <p className="comment-text">{comment.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentList;