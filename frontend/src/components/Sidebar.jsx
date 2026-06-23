import React from 'react';
import './Sidebar.css';

function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <h3>📚 Study App</h3>
      <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '20px 0' }} />
      <button className="sidebar-item btn-logout" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
