import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import QuestionItem from '../components/QuestionItem';
import ExplainModal from '../components/ExplainModal';
import SummarizeModal from '../components/SummarizeModal';
import './FolderPage.css';

function FolderPage({ onLogout }) {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [folderName, setFolderName] = useState('');
  const [allQuestions, setAllQuestions] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [questionSearchTimeout, setQuestionSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        setLoading(true);
        const folderRes = await api.getFolderById(folderId);
        setFolderName(folderRes.data.name);

        const questionsRes = await api.getQuestionsByFolder(folderId);
        setAllQuestions(questionsRes.data);
        setDisplayQuestions(questionsRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load folder data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (folderId) {
      fetchFolderData();
    }
  }, [folderId]);

  const applyConfidenceFilter = (questions, confidence) => {
    if (confidence === null) {
      setDisplayQuestions(questions);
    } else {
      setDisplayQuestions(questions.filter((q) => q.confidence === confidence));
    }
  };

  const handleSearchQuestions = (query) => {
    setSearchQuery(query);
    
    if (questionSearchTimeout) {
      clearTimeout(questionSearchTimeout);
    }
    
    if (!query.trim()) {
      applyConfidenceFilter(allQuestions, confidenceFilter);
      return;
    }

    const newTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchRes = await api.searchQuestions(folderId, query);
        applyConfidenceFilter(searchRes.data, confidenceFilter);
        setError(null);
      } catch (err) {
        setError('Failed to search questions');
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    setQuestionSearchTimeout(newTimeout);
  };

  const handleConfidenceFilter = (confidence) => {
    const newFilter = confidenceFilter === confidence ? null : confidence;
    setConfidenceFilter(newFilter);

    if (searchQuery.trim()) {
      const currentDisplay = displayQuestions;
      applyConfidenceFilter(currentDisplay, newFilter);
    } else {
      applyConfidenceFilter(allQuestions, newFilter);
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setError('Question and answer cannot be empty');
      return;
    }

    try {
      const newQA = await api.createQuestion(folderId, {
        question: newQuestion,
        answer: newAnswer,
      });
      setAllQuestions([...allQuestions, newQA.data]);
      applyConfidenceFilter([...allQuestions, newQA.data], confidenceFilter);
      setNewQuestion('');
      setNewAnswer('');
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create question');
      console.error(err);
    }
  };

  const handleUpdateQuestion = async (questionId, updatedData) => {
    try {
      const updated = await api.updateQuestion(questionId, updatedData);
      const updatedAll = allQuestions.map((q) =>
        q._id === questionId ? updated.data : q
      );
      setAllQuestions(updatedAll);
      applyConfidenceFilter(updatedAll, confidenceFilter);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError('Failed to update question');
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this Q&A?')) return;

    try {
      await api.deleteQuestion(questionId);
      const updatedAll = allQuestions.filter((q) => q._id !== questionId);
      setAllQuestions(updatedAll);
      applyConfidenceFilter(updatedAll, confidenceFilter);
      setError(null);
    } catch (err) {
      setError('Failed to delete question');
      console.error(err);
    }
  };

  const handleOpenExplain = (question) => {
    setSelectedQuestion(question);
    setShowExplainModal(true);
  };

  const handleOpenSummarize = () => {
    setShowSummarizeModal(true);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return <div className="folder-loading">Loading folder...</div>;
  }

  return (
    <div className="page-container">
      <div className="sidebar">
        <h3>Study App</h3>
        <button
          className="sidebar-item"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Folders
        </button>
        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '20px 0' }} />
        <button className="sidebar-item btn-logout" onClick={handleLogoutClick}>
          Logout
        </button>
      </div>

      <div className="main-content">
        <div className="folder-header">
          <div>
            <h1>{folderName}</h1>
            <p className="question-count">{allQuestions.length} questions</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Q&A'}
            </button>
            <button
              className="btn-secondary"
              onClick={handleOpenSummarize}
              disabled={true}
              title="AI features temporarily unavailable"
            >
              📊 Folder Summary (Temporarily Unavailable)
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {showForm && (
          <div className="qa-form">
            <h3>{editingId ? 'Edit Q&A' : 'Create New Q&A'}</h3>
            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                placeholder="Enter your question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Answer</label>
              <textarea
                placeholder="Enter the answer..."
                rows="5"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleCreateQuestion}>
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setNewQuestion('');
                  setNewAnswer('');
                  setEditingId(null);
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
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => handleSearchQuestions(e.target.value)}
          />
          {isSearching && <span className="search-loading">Searching...</span>}
        </div>

        <div className="confidence-filter">
          <label>Filter by confidence:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${confidenceFilter === null ? 'active' : ''}`}
              onClick={() => handleConfidenceFilter(null)}
            >
              All
            </button>
            <button
              className={`filter-btn ${confidenceFilter === 0 ? 'active' : ''}`}
              onClick={() => handleConfidenceFilter(0)}
            >
              🔴 Not Confident (0)
            </button>
            <button
              className={`filter-btn ${confidenceFilter === 1 ? 'active' : ''}`}
              onClick={() => handleConfidenceFilter(1)}
            >
              🟡 Somewhat (1)
            </button>
            <button
              className={`filter-btn ${confidenceFilter === 2 ? 'active' : ''}`}
              onClick={() => handleConfidenceFilter(2)}
            >
              🟢 Confident (2)
            </button>
          </div>
        </div>

        <div className="questions-list">
          {displayQuestions.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchQuery || confidenceFilter !== null
                  ? 'No questions match your search or filter.'
                  : 'No questions yet. Create your first Q&A to get started!'}
              </p>
            </div>
          ) : (
            displayQuestions.map((question) => (
              <QuestionItem
                key={question._id}
                question={question}
                onExplain={() => handleOpenExplain(question)}
                onDelete={() => handleDeleteQuestion(question._id)}
                onUpdate={(data) => handleUpdateQuestion(question._id, data)}
              />
            ))
          )}
        </div>
      </div>

      {showExplainModal && selectedQuestion && (
        <ExplainModal
          question={selectedQuestion.question}
          answer={selectedQuestion.answer}
          onClose={() => setShowExplainModal(false)}
        />
      )}

      {showSummarizeModal && (
        <SummarizeModal
          folderName={folderName}
          questions={allQuestions}
          onClose={() => setShowSummarizeModal(false)}
        />
      )}
    </div>
  );
}

export default FolderPage;