const API_BASE = import.meta.env.VITE_DIRECTUS_BASE_URL || 'http://localhost:8055'

let token = localStorage.getItem('samudra_token') || null

export function setAuthToken(t) {
  token = t
  if (t) localStorage.setItem('samudra_token', t)
  else localStorage.removeItem('samudra_token')
}

export function getAuthToken() {
  return token
}

async function handleRes(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const url = params
    ? `${API_BASE}${path}?${new URLSearchParams(params).toString()}`
    : `${API_BASE}${path}`

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const payload = await handleRes(res)
    const message =
      payload?.errors?.[0]?.message ||
      (typeof payload === 'string' ? payload : JSON.stringify(payload))
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  return handleRes(res)
}
