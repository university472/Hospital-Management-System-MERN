import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Patient from './components/Patient'
import Doctor from './components/Doctors'
import Admin from './components/Admins'
import QueueDisplay from './components/QueueDisplay'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Public queue display screen (no auth — for monitor outside doctor's room) */}
            <Route path="/queue/:doctorId" element={<QueueDisplay />} />

            {/* Protected: Patient */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Patient />
                </ProtectedRoute>
              }
            />

            {/* Protected: Doctor */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Doctor />
                </ProtectedRoute>
              }
            />

            {/* Protected: Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App