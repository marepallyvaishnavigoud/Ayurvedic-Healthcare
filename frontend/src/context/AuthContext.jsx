import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

// Single axios instance used across the whole app
export const api = axios.create()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ayurUser')
      if (!saved) return null
      const parsed = JSON.parse(saved)
      // Validate token structure — 3 parts separated by dots
      if (!parsed?.token || parsed.token.split('.').length !== 3) {
        localStorage.removeItem('ayurUser')
        return null
      }
      return parsed
    } catch {
      localStorage.removeItem('ayurUser')
      return null
    }
  })

  const [loading, setLoading] = useState(false)

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

  // Auto logout on 401 from any request
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          setUser(null)
          localStorage.removeItem('ayurUser')
          window.location.href = '/auth'
        }
        return Promise.reject(err)
      }
    )
    return () => api.interceptors.response.eject(interceptor)
  }, [])

  const saveUser = (data) => {
    setUser(data)
    localStorage.setItem('ayurUser', JSON.stringify(data))
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password })
      saveUser(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/register`, { name, email, password })
      saveUser(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (token) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/google`, { token })
      saveUser(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Google login failed' }
    } finally {
      setLoading(false)
    }
  }


  const logout = () => {
    setUser(null)
    localStorage.removeItem('ayurUser')
  }

  // Always read fresh token from localStorage
  const authHeader = () => {
    try {
      const saved = localStorage.getItem('ayurUser')
      const token = saved ? JSON.parse(saved)?.token : user?.token
      return { headers: { Authorization: `Bearer ${token}` } }
    } catch {
      return { headers: { Authorization: `Bearer ${user?.token}` } }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading, authHeader, API }}>

      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
