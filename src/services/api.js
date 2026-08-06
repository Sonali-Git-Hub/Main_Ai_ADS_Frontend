/**
 * Centralized API Service Layer
 * All frontend API calls go through this module.
 * Base URL auto-detects development vs production.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Core Fetch Helper ─────────────────────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `API Error: ${res.status}`);
  }
  return data;
};

// ─── Workspace API ─────────────────────────────────────────────────────────────
export const workspaceAPI = {
  list: () => apiFetch('/workspace/list'),
  create: (body) => apiFetch('/workspace/create', { method: 'POST', body }),
  uploadDoc: (formData) => fetch(`${BASE_URL}/workspace/upload-doc`, { method: 'POST', body: formData }).then((r) => r.json()),
  update: (id, body) => apiFetch(`/workspace/${id}`, { method: 'PUT', body }),
  delete: (id) => apiFetch(`/workspace/${id}`, { method: 'DELETE' }),
};

// ─── Brand Intelligence API ────────────────────────────────────────────────────
export const brandAPI = {
  analyze: (body) => apiFetch('/brand/analyze', { method: 'POST', body }),
  getProfile: (workspaceId) => apiFetch(`/brand/${workspaceId}`),
  updateProfile: (workspaceId, body) => apiFetch(`/brand/${workspaceId}`, { method: 'PUT', body }),
  regenerateSection: (body) => apiFetch('/brand/regenerate-section', { method: 'POST', body }),
};

// ─── Campaign API ──────────────────────────────────────────────────────────────
export const campaignAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/campaigns${qs ? `?${qs}` : ''}`);
  },
  get: (id) => apiFetch(`/campaigns/${id}`),
  create: (body) => apiFetch('/campaigns', { method: 'POST', body }),
  update: (id, body) => apiFetch(`/campaigns/${id}`, { method: 'PUT', body }),
  delete: (id) => apiFetch(`/campaigns/${id}`, { method: 'DELETE' }),
  getPosts: (id, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/campaigns/${id}/posts${qs ? `?${qs}` : ''}`);
  },
  generatePlan: (id, body = {}) => apiFetch(`/campaigns/${id}/generate-plan`, { method: 'POST', body }),
  generatePostContent: (postId, body = {}) => apiFetch(`/campaigns/posts/${postId}/generate-content`, { method: 'POST', body }),
  updatePostStatus: (postId, body) => apiFetch(`/campaigns/posts/${postId}/status`, { method: 'PATCH', body }),
  calculateDates: (body) => apiFetch('/campaigns/dates/calculate', { method: 'POST', body }),
};

// ─── Content Generation API ────────────────────────────────────────────────────
export const contentAPI = {
  generateSocialPost: (body) => apiFetch('/content/social/generate', { method: 'POST', body }),
  generateBlogDraft: (body) => apiFetch('/content/blog/draft', { method: 'POST', body }),
  generateEmailCopy: (body) => apiFetch('/content/email/generate', { method: 'POST', body }),
  generateAdCopy: (body) => apiFetch('/content/ad-copy/generate', { method: 'POST', body }),
  repurposeContent: (body) => apiFetch('/content/repurpose', { method: 'POST', body }),
  factCheck: (body) => apiFetch('/content/fact-check', { method: 'POST', body }),
};

// ─── SEO API ──────────────────────────────────────────────────────────────────
export const seoAPI = {
  generateBrief: (body) => apiFetch('/seo/brief/generate', { method: 'POST', body }),
};

// ─── Creative Studio API ──────────────────────────────────────────────────────
export const creativeAPI = {
  getCredits: () => apiFetch('/creative/credits'),
  generateVisual: (body) => apiFetch('/creative/visual/generate', { method: 'POST', body }),
  topUpCredits: (body) => apiFetch('/creative/credits/topup', { method: 'POST', body }),
  setTier: (body) => apiFetch('/creative/credits/tier', { method: 'POST', body }),
};

// ─── AISA Chat API ────────────────────────────────────────────────────────────
export const chatAPI = {
  listSessions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/chat/sessions${qs ? `?${qs}` : ''}`);
  },
  getSession: (sessionId) => apiFetch(`/chat/sessions/${sessionId}`),
  sendMessage: (body) => apiFetch('/chat', { method: 'POST', body }),
  deleteSession: (sessionId) => apiFetch(`/chat/sessions/${sessionId}`, { method: 'DELETE' }),
  renameSession: (sessionId, title) => apiFetch(`/chat/sessions/${sessionId}/title`, { method: 'PATCH', body: { title } }),
};

// ─── Calendar API ─────────────────────────────────────────────────────────────
export const calendarAPI = {
  list: () => apiFetch('/calendar/entries'),
  create: (body) => apiFetch('/calendar/entries', { method: 'POST', body }),
};

// ─── Approvals API ────────────────────────────────────────────────────────────
export const approvalsAPI = {
  getQueue: () => apiFetch('/approvals/queue'),
  updateStatus: (body) => apiFetch('/approvals/status', { method: 'PATCH', body }),
};

// ─── Analytics API ────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getSummary: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/analytics/summary${qs ? `?${qs}` : ''}`);
  },
};

// ─── Notifications API ────────────────────────────────────────────────────────
export const notificationsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/notifications${qs ? `?${qs}` : ''}`);
  },
  markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }),
};

// ─── Reminders API ────────────────────────────────────────────────────────────
export const remindersAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/reminders${qs ? `?${qs}` : ''}`);
  },
  create: (body) => apiFetch('/reminders', { method: 'POST', body }),
  update: (id, body) => apiFetch(`/reminders/${id}`, { method: 'PATCH', body }),
  delete: (id) => apiFetch(`/reminders/${id}`, { method: 'DELETE' }),
};

// ─── Health Check ─────────────────────────────────────────────────────────────
export const healthAPI = {
  check: () => apiFetch('/health'),
};

export default {
  workspace: workspaceAPI,
  brand: brandAPI,
  campaign: campaignAPI,
  content: contentAPI,
  seo: seoAPI,
  creative: creativeAPI,
  chat: chatAPI,
  calendar: calendarAPI,
  approvals: approvalsAPI,
  analytics: analyticsAPI,
  notifications: notificationsAPI,
  reminders: remindersAPI,
  health: healthAPI,
};
