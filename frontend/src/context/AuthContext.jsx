import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ayurUser')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  const API = 'https://ayurcare-backend-6r7i.onrender.com/api'


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

  const authHeader = () => ({ headers: { Authorization: `Bearer ${user?.token}` } })

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authHeader, API }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
