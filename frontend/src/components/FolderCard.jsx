import React from 'react';
import './FolderCard.css';

function FolderCard({ folder, onClick, onDelete }) {
  // Handle delete with confirmation
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    onDelete();
  };

  return (
    <div className="folder-card" onClick={onClick}>
      <div className="folder-card-header">
        <div className="folder-icon">{folder.icon || '📁'}</div>
        <button
          className="delete-btn"
          onClick={handleDelete}
          title="Delete folder"
        >
          ✕
        </button>
      </div>

      <div className="folder-card-body">
        <h3>{folder.name}</h3>
        <p className="folder-info">Click to open</p>
      </div>
    </div>
  );
}

export default FolderCard;