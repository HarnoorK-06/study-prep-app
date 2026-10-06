const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
 
// Get token from localStorage
const getToken = () => localStorage.getItem('token');
 
// Headers for requests that need the user to be logged in
const authHeaders = (withJson = false) => {
  const headers = { Authorization: `Bearer ${getToken()}` };
  if (withJson) headers['Content-Type'] = 'application/json';
  return headers;
};
 
// Every logged-in request goes through here.
// If the token is expired or invalid (401), log the user out and send them to /login.
const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, options);
 
  if (res.status === 401 && getToken()) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return { success: false, message: 'Session expired. Please log in again.' };
  }
 
  return res.json();
};
 
// Auth functions (no token needed; a 401 here just means wrong email/password)
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
export const getAllFolders = () =>
  request('/folders', { method: 'GET', headers: authHeaders() });
 
export const getFolderById = (folderId) =>
  request(`/folders/${folderId}`, { method: 'GET', headers: authHeaders() });
 
export const createFolder = (data) =>
  request('/folders', {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(data),
  });
 
export const updateFolder = (folderId, data) =>
  request(`/folders/${folderId}`, {
    method: 'PATCH',
    headers: authHeaders(true),
    body: JSON.stringify(data),
  });
 
export const deleteFolder = (folderId) =>
  request(`/folders/${folderId}`, { method: 'DELETE', headers: authHeaders() });
 
export const searchFolders = (searchTerm) =>
  request(`/folders/search?name=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
    headers: authHeaders(),
  });
 
// Question functions
export const getQuestionsByFolder = (folderId) =>
  request(`/qa/${folderId}`, { method: 'GET', headers: authHeaders() });
 
export const createQuestion = (folderId, data) =>
  request(`/qa/${folderId}`, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(data),
  });
 
export const updateQuestion = (questionId, data) =>
  request(`/qa/${questionId}`, {
    method: 'PATCH',
    headers: authHeaders(true),
    body: JSON.stringify(data),
  });
 
export const updateQuestionConfidence = (questionId, confidence) =>
  request(`/qa/${questionId}/confidence`, {
    method: 'PATCH',
    headers: authHeaders(true),
    body: JSON.stringify({ confidence }),
  });
 
export const deleteQuestion = (questionId) =>
  request(`/qa/${questionId}`, { method: 'DELETE', headers: authHeaders() });
 
export const searchQuestions = (folderId, searchTerm) =>
  request(`/qa/${folderId}/search?term=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
    headers: authHeaders(),
  });
 
// AI functions
export const explainAnswer = (question, answer) =>
  request('/ai/explain', {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ question, answer }),
  });
 
export const summarizeFolder = (folderName, questions) =>
  request('/ai/summarize', {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ folderName, questions }),
  });