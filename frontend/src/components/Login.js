import React, { useState } from 'react'
import { Shield, User, Stethoscope, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { ApiError } from '../utils/api'

const roles = [
  { id: 'admin', label: 'Admin', icon: Shield },
  { id: 'patient', label: 'Patient', icon: User },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope }
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [selectedRole, setSelectedRole] = useState('patient')
  // `identifier` can be email or phone number (for patients)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Hint text under the identifier field based on selected role
  const identifierLabel =
    selectedRole === 'patient' ? 'Email or Phone Number' : 'Email'

  const identifierPlaceholder =
    selectedRole === 'patient'
      ? 'you@example.com or 03001234567'
      : 'Enter your email'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.post('/api/login', {
        identifier: identifier.trim(),
        password,
        role: selectedRole
      })
      login(data.token, data.role)
      if (data.role === 'admin') navigate('/admin')
      else if (data.role === 'doctor') navigate('/doctor')
      else navigate('/patient')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'An error occurred. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">
            Login to HealthCare Portal
          </h2>
          <p className="text-center text-blue-100 mt-1">Access your account</p>
        </div>
        <div className="p-6">
          {/* Role selector */}
          <div className="flex bg-blue-100 rounded-lg p-1 mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id)
                  setIdentifier('')
                  setError('')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${selectedRole === role.id ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
              >
                <role.icon size={16} />
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                {identifierLabel}
              </label>
              <input
                id="identifier"
                type={selectedRole === 'patient' ? 'text' : 'email'}
                value={identifier}
                autoComplete={selectedRole === 'patient' ? 'username' : 'email'}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={identifierPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {selectedRole === 'patient' && (
                <p className="text-xs text-gray-400 mt-1">
                  You can log in with either your email address or your
                  registered phone number.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading
                ? 'Logging in...'
                : `Login as ${roles.find((r) => r.id === selectedRole)?.label}`}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
