import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:5000/api';

function App() {
  const [folders, setFolders] = useState([]);
  const [qas, setQas] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolder, setNewFolder] = useState('');
  const [form, setForm] = useState({ question: '', answer: '', folder: '' });
  const [editing, setEditing] = useState(null);
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchFolders(); fetchQAs(); }, []);
  useEffect(() => { fetchQAs(); }, [selectedFolder]);

  const fetchFolders = async () => {
    const res = await fetch(`${API}/folders`);
    setFolders(await res.json());
  };

  const fetchQAs = async () => {
    const url = selectedFolder ? `${API}/qas?folder=${selectedFolder}` : `${API}/qas`;
    const res = await fetch(url);
    setQas(await res.json());
  };

  const createFolder = async (e) => {
    e.preventDefault();
    if (!newFolder.trim()) return;
    await fetch(`${API}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFolder })
    });
    setNewFolder('');
    fetchFolders();
  };

  const deleteFolder = async (id) => {
    if (!window.confirm('Delete folder and all its Q&As?')) return;
    await fetch(`${API}/folders/${id}`, { method: 'DELETE' });
    if (selectedFolder === id) setSelectedFolder(null);
    fetchFolders();
    fetchQAs();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    const body = { question: form.question, answer: form.answer, folder: form.folder || selectedFolder || null };
    if (editing) {
      await fetch(`${API}/qas/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      setEditing(null);
    } else {
      await fetch(`${API}/qas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setForm({ question: '', answer: '', folder: '' });
    fetchQAs();
  };

  const editQA = (qa) => {
    setForm({ question: qa.question, answer: qa.answer, folder: qa.folder?._id || '' });
    setEditing(qa._id);
  };

  const deleteQA = async (id) => {
    if (!window.confirm('Delete this Q&A?')) return;
    await fetch(`${API}/qas/${id}`, { method: 'DELETE' });
    fetchQAs();
  };

  const aiAction = async (qa, action) => {
    setLoading(true);
    setAiResult('');
    try {
      const res = await fetch(`${API}/ai/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: qa.question, answer: qa.answer })
      });
      const data = await res.json();
      setAiResult(data.summary || data.explanation);
    } catch (err) {
      setAiResult('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>📚 Study Prep</h1>
        <p>Your personal Q&A collection with AI</p>
      </header>
      <div className="container">
        <aside className="sidebar">
          <h2>Folders</h2>
          <form onSubmit={createFolder} className="folder-form">
            <input type="text" placeholder="New folder..." value={newFolder} onChange={(e) => setNewFolder(e.target.value)} />
            <button type="submit">+</button>
          </form>
          <ul className="folder-list">
            <li className={!selectedFolder ? 'active' : ''} onClick={() => setSelectedFolder(null)}>📁 All Q&As</li>
            {folders.map(f => (
              <li key={f._id} className={selectedFolder === f._id ? 'active' : ''}>
                <span onClick={() => setSelectedFolder(f._id)}>📂 {f.name}</span>
                <button onClick={() => deleteFolder(f._id)} className="delete-btn">×</button>
              </li>
            ))}
          </ul>
        </aside>
        <main>
          <form onSubmit={handleSubmit} className="qa-form">
            <h2>{editing ? 'Edit Q&A' : 'Add New Q&A'}</h2>
            <input type="text" placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            <textarea placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} />
            <select value={form.folder} onChange={(e) => setForm({ ...form, folder: e.target.value })}>
              <option value="">No folder</option>
              {folders.map(f => (<option key={f._id} value={f._id}>{f.name}</option>))}
            </select>
            <div className="form-actions">
              <button type="submit">{editing ? 'Update' : 'Add Q&A'}</button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm({ question: '', answer: '', folder: '' }); }}>Cancel</button>}
            </div>
          </form>
          {(loading || aiResult) && (
            <div className="ai-result">
              <h3>🤖 AI Says:</h3>
              {loading ? <p>Thinking...</p> : <pre>{aiResult}</pre>}
              <button onClick={() => setAiResult('')}>Close</button>
            </div>
          )}
          <div className="qa-list">
            <h2>Your Q&As ({qas.length})</h2>
            {qas.length === 0 ? <p className="empty">No Q&As yet. Add your first one above!</p> : qas.map(qa => (
              <div key={qa._id} className="qa-card">
                <div className="qa-content">
                  <h3>Q: {qa.question}</h3>
                  <p>A: {qa.answer}</p>
                  {qa.folder && <span className="folder-tag">📂 {qa.folder.name}</span>}
                </div>
                <div className="qa-actions">
                  <button onClick={() => aiAction(qa, 'summarize')} title="Summarize">📝</button>
                  <button onClick={() => aiAction(qa, 'explain')} title="Explain Simply">💡</button>
                  <button onClick={() => editQA(qa)} title="Edit">✏️</button>
                  <button onClick={() => deleteQA(qa._id)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;