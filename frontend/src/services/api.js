const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth functions
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const signup = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// Folder functions
export const getAllFolders = async () => {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const getFolderById = async (folderId) => {
  const res = await fetch(`${BASE_URL}/folders/${folderId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const createFolder = async (data) => {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateFolder = async (folderId, data) => {
  const res = await fetch(`${BASE_URL}/folders/${folderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteFolder = async (folderId) => {
  const res = await fetch(`${BASE_URL}/folders/${folderId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const searchFolders = async (searchTerm) => {
  const res = await fetch(`${BASE_URL}/folders/search?name=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

// Question functions
export const getQuestionsByFolder = async (folderId) => {
  const res = await fetch(`${BASE_URL}/qa/${folderId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const createQuestion = async (folderId, data) => {
  const res = await fetch(`${BASE_URL}/qa/${folderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateQuestion = async (questionId, data) => {
  const res = await fetch(`${BASE_URL}/qa/${questionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateQuestionConfidence = async (questionId, confidence) => {
  const res = await fetch(`${BASE_URL}/qa/${questionId}/confidence`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ confidence }),
  });
  return res.json();
};

export const deleteQuestion = async (questionId) => {
  const res = await fetch(`${BASE_URL}/qa/${questionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const searchQuestions = async (folderId, searchTerm) => {
  const res = await fetch(`${BASE_URL}/qa/${folderId}/search?term=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

// AI functions
export const explainAnswer = async (question, answer) => {
  const res = await fetch(`${BASE_URL}/ai/explain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ question, answer }),
  });
  return res.json();
};

export const summarizeFolder = async (folderName, questions) => {
  const res = await fetch(`${BASE_URL}/ai/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ folderName, questions }),
  });
  return res.json();
};