/**
 * api.js  –  Central fetch wrapper
 * All API calls go through here so auth headers and error handling are consistent.
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  // Token expired → clear storage and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
    throw new ApiError('Session expired. Please log in again.', 401)
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(data.error || 'An error occurred', response.status)
  }

  return data
}

// ── Multipart upload (no Content-Type header — browser sets boundary) ─────────
async function uploadFiles(endpoint, formData) {
  const token = localStorage.getItem('token')
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new ApiError('Session expired', 401)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok)
    throw new ApiError(data.error || 'Upload failed', response.status)
  return data
}

const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, body) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) =>
    request(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body) =>
    request(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),
  upload: (url, formData) => uploadFiles(url, formData)
}

export default api
export { ApiError }
