import axiosInstance from './axios'

// Try the common Directus auth endpoints. Some Directus installs use
// `/auth/login` while others use `/auth/authenticate`.
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password })
    return normalizeResponse(response)
  } catch (err) {
    // If route not found, try the alternate endpoint
    const status = err?.response?.status
    const routeNotFound = err?.response?.data?.errors?.[0]?.code === 'ROUTE_NOT_FOUND' || status === 404
    if (routeNotFound) {
      const response = await axiosInstance.post('/auth/authenticate', { email, password })
      return normalizeResponse(response)
    }
    throw err
  }
}

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout')
  return normalizeResponse(response)
}

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me', {
    params: { fields: 'id,email,first_name,last_name,role.id,role.name' },
  })
  return normalizeResponse(response)
}

function normalizeResponse(response) {
  // axios returns { data: <body> }. Directus typically returns { data: { ... } }
  // We return the inner body so callers can access `data` the same way as before.
  return response.data
}
