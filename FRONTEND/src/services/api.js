const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getAuthToken = () => localStorage.getItem('carbonlens_token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('carbonlens_token', token);
  } else {
    localStorage.removeItem('carbonlens_token');
  }
};

export const apiRequest = async (path, options = {}) => {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.msg || data?.message || 'API request failed');
  }

  return data;
};

export const api = {
  login: (payload) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  register: (payload) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  estimateEmission: (payload) => apiRequest('/emissions/estimate', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getEmissionSummary: () => apiRequest('/emissions/summary'),
  getEmissionHistory: () => apiRequest('/emissions/history'),
  getRealtimeSnapshot: () => apiRequest('/realtime/snapshot'),
  createCommunityPost: (payload) => apiRequest('/realtime/community/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  likeCommunityPost: (id) => apiRequest(`/realtime/community/posts/${id}/like`, {
    method: 'POST',
  }),
  forgotPassword: (payload) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  resetPassword: (payload) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  createLedgerEntry: (payload) => apiRequest('/ledger', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getUserLedger: (userId) => apiRequest(`/ledger/user/${userId}`),
  syncSensors: () => apiRequest('/sensors/sync'),
  runForecast: (payload) => apiRequest('/forecast', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  uploadDocument: (formData) => apiRequest('/documents/upload', {
    method: 'POST',
    body: formData,
  }),
  uploadCommunityAttachment: (formData) => apiRequest('/community/upload', {
    method: 'POST',
    body: formData,
  }),
  createComment: (payload) => apiRequest('/comments', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getComments: (postId) => apiRequest(`/comments/${postId}`),
  joinCircle: (payload) => apiRequest('/circles/join', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getUserCircles: (userId) => apiRequest(`/circles/user/${userId}`),
  createAdminEntry: (payload) => apiRequest('/admin/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  verifyAdminEntry: (id) => apiRequest(`/admin/verify/${id}`, { method: 'PATCH' }),
  flagAdminEntry: (id) => apiRequest(`/admin/flag/${id}`, { method: 'PATCH' }),
  updateProfile: (formData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: formData,
  }),
  askAssistant: (payload) => apiRequest('/assistant', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
