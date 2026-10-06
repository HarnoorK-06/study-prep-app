import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './SummarizeModal.css';
import * as api from '../services/api';

function SummarizeModal({ folderName, questions, onClose }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Only send what the AI needs (not ids, dates, confidence, etc.)
      const qaPairs = questions.map((q) => ({ question: q.question, answer: q.answer }));
      const response = await api.summarizeFolder(folderName, qaPairs);
      if (response.success) {
        setSummary(response.data.summary);
      } else {
        setError(response.message || 'Failed to generate summary');
      }
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [folderName, questions]);

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
          {error && (
            <div className="error">
              <p>{error}</p>
              <button onClick={fetchSummary}>Try again</button>
            </div>
          )}
          {summary && (
            <div className="summary-box">
              <h4>Summary:</h4>
              {/* Shows the AI's Markdown formatting safely (no HTML is run) */}
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummarizeModal;