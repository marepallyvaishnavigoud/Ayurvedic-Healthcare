import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ayurUser')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  // Use REACT_APP_API_URL env var in production (set in Vercel dashboard)
  // Falls back to localhost for local development
  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password })
      setUser(data)
      localStorage.setItem('ayurUser', JSON.stringify(data))
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
      setUser(data)
      localStorage.setItem('ayurUser', JSON.stringify(data))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ayurUser')
  }

  // Always read fresh token from localStorage to avoid stale token issues
  const authHeader = () => {
    try {
      const saved = localStorage.getItem('ayurUser')
      const parsed = saved ? JSON.parse(saved) : null
      const token = parsed?.token
      return { headers: { Authorization: `Bearer ${token}` } }
    } catch {
      return { headers: { Authorization: `Bearer ${user?.token}` } }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authHeader, API }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
