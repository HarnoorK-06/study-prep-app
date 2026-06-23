// 1. Import React hooks and utilities
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. Import API calls
import * as api from '../services/api';
// 3. Import components
import Sidebar from '../components/Sidebar';
import FolderCard from '../components/FolderCard';
// 4. Import CSS
import './DashboardPage.css';

// Icon options for folders
const ICON_OPTIONS = ['📁', '📚', '📖', '✏️', '🎓', '💡', '🔬', '📝', '🎯', '⭐'];

function DashboardPage({ onLogout }) {
  // 5. Set up navigation
  const navigate = useNavigate();

  // 6. Create state for folders and UI
  const [folders, setFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // 7. Fetch all folders when page loads
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const foldersRes = await api.getAllFolders();
        setFolders(foldersRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load folders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  // 8. Handle search with debouncing
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // If empty, show all folders
    if (!query.trim()) {
      const fetchAll = async () => {
        try {
          const foldersRes = await api.getAllFolders();
          setFolders(foldersRes.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAll();
      return;
    }

    // Set new timeout - search after 300ms of no typing
    const newTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchRes = await api.searchFolders(query);
        setFolders(searchRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to search folders');
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    setSearchTimeout(newTimeout);
  };

  // 9. Handle create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }

    try {
      const newFolder = await api.createFolder({ 
        name: newFolderName,
        icon: selectedIcon,
        colour: '#0d3158'
      });
      setFolders([...folders, newFolder.data]);
      setNewFolderName('');
      setSelectedIcon(ICON_OPTIONS[0]);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create folder');
      console.error(err);
    }
  };

  // 10. Handle delete folder
  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure you want to delete this folder?')) return;

    try {
      await api.deleteFolder(folderId);
      setFolders(folders.filter((f) => f._id !== folderId));
      setError(null);
    } catch (err) {
      setError('Failed to delete folder');
      console.error(err);
    }
  };

  // 11. Handle folder click (navigate to folder)
  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  // 12. Show loading state
  if (loading) {
    return <div className="dashboard-loading">Loading folders...</div>;
  }

  // 13. Return dashboard JSX
  return (
    <div className="page-container">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <div className="dashboard-header">
          <h1>My Study Folders</h1>
          <button
            className="btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ New Folder'}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {showAddForm && (
          <div className="add-folder-form">
            <input
              type="text"
              placeholder="Enter folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            
            <div className="icon-picker">
              <label>Choose an icon:</label>
              <div className="icon-options">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    className={`icon-btn ${selectedIcon === icon ? 'selected' : ''}`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleCreateFolder}>
                Create
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewFolderName('');
                  setSelectedIcon(ICON_OPTIONS[0]);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && <span className="search-loading">Searching...</span>}
        </div>

        <div className="folders-grid">
          {folders.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchQuery
                  ? 'No folders match your search.'
                  : 'No folders yet. Create your first folder to get started!'}
              </p>
            </div>
          ) : (
            folders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onClick={() => handleFolderClick(folder._id)}
                onDelete={() => handleDeleteFolder(folder._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
