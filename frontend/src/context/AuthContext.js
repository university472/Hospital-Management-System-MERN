import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [role, setRole] = useState(() => localStorage.getItem('userRole'))
  const [loading, setLoading] = useState(false)

  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('userRole', newRole)
    setToken(newToken)
    setRole(newRole)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, role, loading, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
