import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../api/auth'
import { setAuthToken, getAuthToken } from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const data = await getCurrentUser()
  //       setUser(data.data)
  //       setIsAuthenticated(true)
  //     } catch {
  //       setIsAuthenticated(false)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   checkSession()
  // }, [])

  useEffect(() => {
    const init = async () => {
      const token = getAuthToken()
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        const resp = await getCurrentUser()
        setUser(resp.data)
        setIsAuthenticated(true)
      } catch (e) {
        setUser(null)
        setIsAuthenticated(false)
        setAuthToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    const token = data.data?.access_token || data.data?.accessToken
    if (!token) throw new Error('No access token returned')
    setAuthToken(token)
    setAccessToken(token)
    const userResponse = await getCurrentUser()
    setUser(userResponse.data)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {
      // continue logout even if api call fails
    }
    setAuthToken(null)
    setAccessToken(null)
    setUser(null)
    setIsAuthenticated(false)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      logout,
      isAdmin: Boolean(
        (typeof user?.role === 'object' ? user?.role?.name : user?.role)?.toLowerCase?.() === 'administrator'
      ),
      isClient: Boolean(
        (typeof user?.role === 'object' ? user?.role?.name : user?.role)?.toLowerCase?.() === 'client'
      ),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
