import React, { useState, useEffect, useCallback } from 'react';
import './SummarizeModal.css';
import * as api from '../services/api';

function SummarizeModal({ folderName, questions, onClose }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // MOVED UP and wrapped in useCallback
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.summarizeFolder(folderName, questions);
      if (response.success) {
        setSummary(response.data.summary);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  }, [folderName, questions]);

  // NOW use it here
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="summarize-overlay" onClick={onClose}>
      <div className="summarize-modal" onClick={(e) => e.stopPropagation()}>
        <div className="summarize-header">
          <h2>📊 Summary: {folderName}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="summarize-body">
          {loading && <p className="loading">Generating summary...</p>}
          {error && <p className="error">{error}</p>}
          {summary && (
            <div className="summary-box">
              <h4>Summary:</h4>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummarizeModal;