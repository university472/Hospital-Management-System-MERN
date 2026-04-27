import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Hospital, Mail, Phone } from 'lucide-react'
import api, { ApiError } from '../utils/api'

export default function SignUp() {
  const navigate = useNavigate()

  // 'email' | 'phone'
  const [contactMethod, setContactMethod] = useState('email')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.firstName.trim()) e.firstName = 'First name is required'
    if (!formData.lastName.trim()) e.lastName = 'Last name is required'

    if (contactMethod === 'email') {
      if (!formData.email) e.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        e.email = 'Invalid email address'
    } else {
      if (!formData.phone) e.phone = 'Phone number is required'
      else if (
        !/^(\+92|0092|0)?[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))
      )
        e.phone = 'Enter a valid Pakistani number (e.g. 03001234567)'
    }

    if (!formData.password) e.password = 'Password is required'
    else if (formData.password.length < 8)
      e.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(formData.password))
      e.password = 'Must contain an uppercase letter'
    else if (!/[0-9]/.test(formData.password))
      e.password = 'Must contain a number'

    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('/api/signup', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: contactMethod === 'email' ? formData.email : undefined,
        phone: contactMethod === 'phone' ? formData.phone : undefined,
        password: formData.password
      })
      navigate('/login', {
        state: { message: 'Account created! Please log in.' }
      })
    } catch (err) {
      setErrors({
        submit:
          err instanceof ApiError
            ? err.message
            : 'An error occurred. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hospital className="h-6 w-6" />
            <span className="font-bold text-lg">
              Hospital Management System
            </span>
          </div>
          <h2 className="text-2xl font-bold text-center">
            Create Patient Account
          </h2>
          <p className="text-center text-blue-100 text-sm mt-1">
            Register to access health services
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-blue-800 mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full rounded-md border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 px-3 py-2 text-sm ${errors.firstName ? 'border-red-400' : 'border-blue-200'}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-blue-800 mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full rounded-md border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 px-3 py-2 text-sm ${errors.lastName ? 'border-red-400' : 'border-blue-200'}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact method toggle */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Contact Method
              </label>
              <div className="flex bg-blue-50 rounded-lg p-1 border border-blue-200">
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${contactMethod === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-100'}`}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${contactMethod === 'phone' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-100'}`}
                >
                  <Phone className="h-4 w-4" />
                  Phone
                </button>
              </div>
            </div>

            {/* Email OR Phone field */}
            {contactMethod === 'email' ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-blue-800 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`block w-full rounded-md border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 px-3 py-2 text-sm ${errors.email ? 'border-red-400' : 'border-blue-200'}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-blue-800 mb-1"
                >
                  Phone Number
                  <span className="text-blue-400 font-normal ml-1">
                    (Pakistani number)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                    🇵🇰
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="03001234567"
                    className={`block w-full rounded-md border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 pl-9 pr-3 py-2 text-sm ${errors.phone ? 'border-red-400' : 'border-blue-200'}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Formats accepted: 03001234567 &nbsp;|&nbsp; +923001234567
                </p>
                <p className="text-xs text-blue-500 mt-0.5">
                  📱 Your appointment token and time will be sent to this number
                  via SMS.
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`block w-full rounded-md border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 px-3 py-2 text-sm ${errors.password ? 'border-red-400' : 'border-blue-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Confirm Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`block w-full rounded-md border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 px-3 py-2 text-sm ${errors.confirmPassword ? 'border-red-400' : 'border-blue-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="bg-blue-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
