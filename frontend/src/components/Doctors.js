import React, { useState, useEffect, useCallback } from 'react'
import {
  Calendar,
  Users,
  ChevronDown,
  Home,
  UserCircle,
  Hospital,
  History,
  CheckCircle,
  PlayCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  PillIcon,
  ClipboardList
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

// ── UI primitives ─────────────────────────────────────────────────────────────
const Btn = ({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => (
  <button
    disabled={disabled}
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm
      transition-colors focus:outline-none disabled:opacity-50
      ${
        variant === 'primary'
          ? 'text-white bg-blue-600 hover:bg-blue-700'
          : variant === 'danger'
            ? 'text-white bg-red-600 hover:bg-red-700'
            : variant === 'success'
              ? 'text-white bg-green-600 hover:bg-green-700'
              : variant === 'ghost'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-blue-600 border border-blue-600 hover:bg-blue-50'
      } ${className}`}
    {...props}
  >
    {children}
  </button>
)
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
)
const CardH = ({ children, icon: Icon }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
    {children}
    {Icon && <Icon className="h-5 w-5 text-blue-600 ml-2" />}
  </div>
)
const CT = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
)
const CC = ({ children }) => <div className="px-4 py-5 sm:p-6">{children}</div>
const CF = ({ children }) => <div className="px-4 py-4 sm:px-6">{children}</div>
const Inp = (props) => (
  <input
    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md px-3 py-2"
    {...props}
  />
)
const Lbl = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
)
const Sel = ({ children, ...props }) => (
  <select
    className="mt-1 block w-full pr-10 py-2 px-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    {...props}
  >
    {children}
  </select>
)
const Msg = ({ text, type }) =>
  !text ? null : (
    <div
      className={`flex items-center gap-2 p-3 rounded-md text-sm mb-3 ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      {text}
    </div>
  )

// ── Empty medicine row factory ────────────────────────────────────────────────
const emptyMed = () => ({
  medication: '',
  dosage: '',
  frequency: '',
  notes: ''
})

const TABS = [
  { id: 'Dashboard', icon: Home, label: 'Dashboard' },
  { id: 'Profile', icon: UserCircle, label: 'Profile' },
  { id: 'Queue', icon: Calendar, label: "Today's Queue" },
  { id: 'Patients', icon: Users, label: 'Patients' },
  { id: 'History', icon: History, label: 'All Records' }
]

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [activeTab, setActiveTab] = useState('Dashboard')
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [editedInfo, setEditedInfo] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [todayAppts, setTodayAppts] = useState([])
  const [allAppts, setAllAppts] = useState([])
  const [patients, setPatients] = useState([])
  const [stats, setStats] = useState(null)
  const [showAppts, setShowAppts] = useState(false)
  const [showPats, setShowPats] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Patient management
  const [selectedPatient, setSelectedPatient] = useState('')
  const [patientHistory, setPatientHistory] = useState(null)
  const [patientRxs, setPatientRxs] = useState([])
  const [action, setAction] = useState('')

  // ── Multi-medicine prescription state ──────────────────────────────────────
  // medicines = array of { medication, dosage, frequency, notes }
  const [medicines, setMedicines] = useState([emptyMed()])
  const [rxSaving, setRxSaving] = useState(false)

  // Schedule appointment
  const [schedForm, setSchedForm] = useState({
    patientId: '',
    date: '',
    queueNumber: '',
    estimatedTime: '',
    tokenCode: '',
    reason: ''
  })
  const [slots, setSlots] = useState([])

  // Medical record form
  const [recForm, setRecForm] = useState({
    appointmentId: '',
    chiefComplaint: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  })

  const flash = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 4000)
  }

  const load = useCallback(async () => {
    try {
      const [profile, today, allA, pats, s] = await Promise.all([
        api.get('/api/doctor/profile'),
        api.get('/api/doctor/appointments'),
        api.get('/api/doctor/appointments/all'),
        api.get('/api/doctor/patients-with-appointments'),
        api.get('/api/doctor/stats')
      ])
      setDoctorInfo(profile)
      setEditedInfo(profile)
      setTodayAppts(today)
      setAllAppts(allA)
      setPatients(pats)
      setStats(s)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!selectedPatient) {
      setPatientRxs([])
      setPatientHistory(null)
      return
    }
    Promise.all([
      api.get(`/api/doctor/prescriptions/${selectedPatient}`),
      api.get(`/api/doctor/patient-full-history/${selectedPatient}`)
    ])
      .then(([rxs, hist]) => {
        setPatientRxs(rxs)
        setPatientHistory(hist)
      })
      .catch(() => {})
  }, [selectedPatient])

  useEffect(() => {
    if (!schedForm.patientId || !schedForm.date) {
      setSlots([])
      return
    }
    api
      .get(
        `/api/doctor/available-slots?doctorId=${doctorInfo?._id}&date=${schedForm.date}`
      )
      .then(setSlots)
      .catch(() => setSlots([]))
  }, [schedForm.date, schedForm.patientId, doctorInfo])

  const updateStatus = async (apptId, status) => {
    try {
      await api.patch(`/api/doctor/appointment/${apptId}/status`, { status })
      flash(`Status updated to ${status}`)
      load()
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const handleSaveProfile = async () => {
    try {
      await api.put('/api/doctor/profile', editedInfo)
      setDoctorInfo(editedInfo)
      setIsEditing(false)
      flash('Profile updated')
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  // ── Multi-medicine helpers ────────────────────────────────────────────────
  const updateMed = (index, field, value) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }

  const addMedRow = () => setMedicines((prev) => [...prev, emptyMed()])

  const removeMedRow = (index) => {
    if (medicines.length === 1) return // always keep at least one row
    setMedicines((prev) => prev.filter((_, i) => i !== index))
  }

  const resetMedForm = () => setMedicines([emptyMed()])

  /**
   * Save all medicines in the list as separate prescriptions in one go.
   * Each row = one Prescription document (matches backend model).
   */
  const handleSaveAllPrescriptions = async (e) => {
    e.preventDefault()
    if (!selectedPatient) return flash('Select a patient first', 'error')

    const valid = medicines.every(
      (m) => m.medication.trim() && m.dosage.trim() && m.frequency.trim()
    )
    if (!valid)
      return flash(
        'All medicines need Medication, Dosage and Frequency filled in',
        'error'
      )

    setRxSaving(true)
    try {
      // Fire all saves concurrently
      await Promise.all(
        medicines.map((m) =>
          api.post('/api/doctor/prescribe-medication', {
            patientId: selectedPatient,
            medication: m.medication.trim(),
            dosage: m.dosage.trim(),
            frequency: m.frequency.trim(),
            notes: m.notes.trim()
          })
        )
      )
      flash(`${medicines.length} prescription(s) saved successfully`)
      resetMedForm()
      // Refresh patient prescriptions
      api
        .get(`/api/doctor/prescriptions/${selectedPatient}`)
        .then(setPatientRxs)
    } catch (err) {
      flash(err.message, 'error')
    } finally {
      setRxSaving(false)
    }
  }

  const handleDeleteRx = async (id) => {
    if (!window.confirm('Delete this prescription?')) return
    try {
      await api.delete(`/api/doctor/prescriptions/${id}`)
      flash('Deleted')
      api
        .get(`/api/doctor/prescriptions/${selectedPatient}`)
        .then(setPatientRxs)
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const handleSchedule = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/doctor/schedule-appointment', schedForm)
      flash('Appointment scheduled')
      setSchedForm({
        patientId: '',
        date: '',
        queueNumber: '',
        estimatedTime: '',
        tokenCode: '',
        reason: ''
      })
      load()
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const handleSaveRecord = async (e) => {
    e.preventDefault()
    if (!selectedPatient) return flash('Select a patient first', 'error')
    try {
      await api.post('/api/doctor/medical-records', {
        patientId: selectedPatient,
        ...recForm
      })
      flash('Record saved')
      setRecForm({
        appointmentId: '',
        chiefComplaint: '',
        diagnosis: '',
        treatment: '',
        notes: ''
      })
      load()
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          {
            label: 'Today',
            value: stats?.totalToday ?? '—',
            sub: 'appointments today'
          },
          {
            label: 'Patients',
            value: stats?.totalPatients ?? '—',
            sub: 'under your care'
          },
          {
            label: 'Treated',
            value: stats?.totalTreated ?? '—',
            sub: 'completed visits'
          }
        ].map((s) => (
          <Card key={s.label}>
            <CC>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </CC>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardH icon={Calendar}>
            <CT>Today's Appointments</CT>
          </CardH>
          <CC>
            <div className="text-2xl font-bold">{todayAppts.length}</div>
            {todayAppts[0] ? (
              <p className="text-xs text-gray-500">
                Next: {todayAppts[0].patientId?.firstName}{' '}
                {todayAppts[0].patientId?.lastName} — Token{' '}
                {todayAppts[0].tokenCode}
              </p>
            ) : (
              <p className="text-xs text-gray-500">No appointments today</p>
            )}
          </CC>
          <CF>
            <Btn
              variant="outline"
              className="w-full"
              onClick={() => setShowAppts(!showAppts)}
            >
              {showAppts ? 'Hide' : 'View'} Queue
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${showAppts ? 'rotate-180' : ''}`}
              />
            </Btn>
          </CF>
          {showAppts && (
            <div className="px-4 pb-4 space-y-2">
              {todayAppts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  No appointments
                </p>
              ) : (
                todayAppts.map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-t gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-blue-700">
                        {a.tokenCode}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {a.patientId?.firstName} {a.patientId?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {a.reason}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {a.status === 'scheduled' && (
                        <Btn
                          variant="outline"
                          className="text-xs px-2 py-1"
                          onClick={() => updateStatus(a._id, 'in-progress')}
                        >
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Start
                        </Btn>
                      )}
                      {a.status === 'in-progress' && (
                        <Btn
                          variant="success"
                          className="text-xs px-2 py-1"
                          onClick={() => updateStatus(a._id, 'completed')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </Btn>
                      )}
                      {['scheduled', 'in-progress'].includes(a.status) && (
                        <Btn
                          variant="danger"
                          className="text-xs px-2 py-1"
                          onClick={() => updateStatus(a._id, 'no-show')}
                        >
                          <XCircle className="h-3 w-3" />
                        </Btn>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded-full self-center ${a.status === 'completed' ? 'bg-green-100 text-green-700' : a.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
        <Card>
          <CardH icon={Users}>
            <CT>Patients</CT>
          </CardH>
          <CC>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-gray-500">
              Total patients under your care
            </p>
          </CC>
          <CF>
            <Btn
              variant="outline"
              className="w-full"
              onClick={() => setShowPats(!showPats)}
            >
              {showPats ? 'Hide' : 'View All'} Patients
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${showPats ? 'rotate-180' : ''}`}
              />
            </Btn>
          </CF>
          {showPats && (
            <div className="px-4 pb-4 space-y-2">
              {patients.map((p, i) => (
                <div key={i} className="py-2 border-t">
                  <p className="text-sm font-medium">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last:{' '}
                    {p.lastVisit
                      ? new Date(p.lastVisit).toLocaleDateString('en-GB')
                      : 'N/A'}{' '}
                    | Completed: {p.totalCompleted}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  )

  const renderProfile = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardH>
        <CT>Doctor Profile</CT>
      </CardH>
      <CC>
        <div className="space-y-4">
          {[
            { id: 'firstName', label: 'First Name', key: 'firstName' },
            { id: 'lastName', label: 'Last Name', key: 'lastName' },
            { id: 'email', label: 'Email', key: 'email', type: 'email' },
            { id: 'specialty', label: 'Specialty', key: 'specialty' },
            { id: 'licenseNumber', label: 'License #', key: 'licenseNumber' },
            { id: 'phoneNumber', label: 'Phone', key: 'phoneNumber' }
          ].map((f) => (
            <div key={f.id}>
              <Lbl htmlFor={f.id}>{f.label}</Lbl>
              <Inp
                id={f.id}
                type={f.type || 'text'}
                value={
                  isEditing
                    ? editedInfo?.[f.key] || ''
                    : doctorInfo?.[f.key] || ''
                }
                onChange={(e) =>
                  setEditedInfo((p) => ({ ...p, [f.key]: e.target.value }))
                }
                readOnly={!isEditing}
              />
            </div>
          ))}
          <Msg {...msg} />
        </div>
      </CC>
      <CF>
        {isEditing ? (
          <>
            <Btn onClick={handleSaveProfile} className="mr-2">
              Save
            </Btn>
            <Btn variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Btn>
          </>
        ) : (
          <Btn onClick={() => setIsEditing(true)} className="ml-auto">
            Edit Profile
          </Btn>
        )}
      </CF>
    </Card>
  )

  const renderQueue = () => (
    <Card className="w-full max-w-3xl mx-auto">
      <CardH icon={Calendar}>
        <CT>
          Today's Queue —{' '}
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </CT>
      </CardH>
      <CC>
        <Msg {...msg} />
        {todayAppts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No appointments scheduled today.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2 pr-4">Token</th>
                  <th className="pb-2 pr-4">Patient</th>
                  <th className="pb-2 pr-4">Est. Time</th>
                  <th className="pb-2 pr-4">Reason</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayAppts.map((a, i) => (
                  <tr
                    key={i}
                    className={`border-b last:border-0 ${a.status === 'in-progress' ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="py-3 pr-4 font-bold text-blue-700">
                      {a.tokenCode}
                    </td>
                    <td className="py-3 pr-4">
                      {a.patientId?.firstName} {a.patientId?.lastName}
                    </td>
                    <td className="py-3 pr-4">{a.estimatedTime}</td>
                    <td className="py-3 pr-4 max-w-xs truncate">{a.reason}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${a.visitType === 'follow-up' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {a.visitType}
                      </span>
                      {a.isFree && (
                        <span className="ml-1 text-xs text-green-600">
                          FREE
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        {a.status === 'scheduled' && (
                          <Btn
                            variant="outline"
                            className="text-xs px-2 py-1"
                            onClick={() => updateStatus(a._id, 'in-progress')}
                          >
                            ▶ Start
                          </Btn>
                        )}
                        {a.status === 'in-progress' && (
                          <Btn
                            variant="success"
                            className="text-xs px-2 py-1"
                            onClick={() => updateStatus(a._id, 'completed')}
                          >
                            ✓ Done
                          </Btn>
                        )}
                        {a.status === 'in-progress' && (
                          <Btn
                            variant="primary"
                            className="text-xs px-2 py-1"
                            onClick={() => {
                              setSelectedPatient(a.patientId?._id)
                              setAction('record')
                              setActiveTab('Patients')
                            }}
                          >
                            📋 Notes
                          </Btn>
                        )}
                        {!['completed', 'cancelled', 'no-show'].includes(
                          a.status
                        ) && (
                          <Btn
                            variant="danger"
                            className="text-xs px-2 py-1"
                            onClick={() => updateStatus(a._id, 'no-show')}
                          >
                            ✕
                          </Btn>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full self-center ${a.status === 'completed' ? 'bg-green-100 text-green-700' : a.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {doctorInfo && (
          <div className="mt-6 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700 font-medium">
              Display Screen URL:
            </p>
            <code className="text-xs text-blue-600 break-all">
              {window.location.origin}/queue/{doctorInfo._id}
            </code>
          </div>
        )}
      </CC>
    </Card>
  )

  // ── Multi-medicine prescription UI ────────────────────────────────────────
  const renderPrescribePanel = () => (
    <Card>
      <CardH icon={PillIcon}>
        <CT>Prescriptions</CT>
      </CardH>
      <CC>
        {/* Existing prescriptions list */}
        {patientRxs.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Current Prescriptions
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {patientRxs.map((rx) => (
                <div
                  key={rx._id}
                  className="flex justify-between items-start bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">
                      {rx.medication}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {rx.dosage} &bull; {rx.frequency}
                    </p>
                    {rx.notes && (
                      <p className="text-gray-500 text-xs italic mt-0.5">
                        {rx.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteRx(rx._id)}
                    className="ml-3 text-red-400 hover:text-red-600 flex-shrink-0"
                    title="Delete prescription"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 my-5" />
          </div>
        )}

        {/* Add new prescriptions — multi-row form */}
        <form onSubmit={handleSaveAllPrescriptions}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              Add New Medicine(s)
            </p>
            <span className="text-xs text-gray-400">
              {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} in
              list
            </span>
          </div>

          <div className="space-y-4">
            {medicines.map((med, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
              >
                {/* Row header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    Medicine {idx + 1}
                  </span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedRow(idx)}
                      className="text-red-400 hover:text-red-600"
                      title="Remove this medicine"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Medicine fields — 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Lbl>Medication *</Lbl>
                    <Inp
                      value={med.medication}
                      onChange={(e) =>
                        updateMed(idx, 'medication', e.target.value)
                      }
                      placeholder="e.g. Paracetamol"
                      required
                    />
                  </div>
                  <div>
                    <Lbl>Dosage *</Lbl>
                    <Inp
                      value={med.dosage}
                      onChange={(e) => updateMed(idx, 'dosage', e.target.value)}
                      placeholder="e.g. 500mg"
                      required
                    />
                  </div>
                  <div>
                    <Lbl>Frequency *</Lbl>
                    <Inp
                      value={med.frequency}
                      onChange={(e) =>
                        updateMed(idx, 'frequency', e.target.value)
                      }
                      placeholder="e.g. Twice daily after meals"
                      required
                    />
                  </div>
                  <div>
                    <Lbl>Notes</Lbl>
                    <Inp
                      value={med.notes}
                      onChange={(e) => updateMed(idx, 'notes', e.target.value)}
                      placeholder="Optional instructions"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add another medicine button */}
          <button
            type="button"
            onClick={addMedRow}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 text-sm font-medium hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Another Medicine
          </button>

          {/* Save all button */}
          <div className="mt-4 flex items-center gap-3">
            <Btn type="submit" disabled={rxSaving} className="flex-1">
              {rxSaving
                ? 'Saving...'
                : `Save ${medicines.length > 1 ? `All ${medicines.length} Prescriptions` : 'Prescription'}`}
            </Btn>
            {medicines.length > 1 && (
              <Btn
                type="button"
                variant="outline"
                onClick={resetMedForm}
                className="text-sm"
              >
                Clear All
              </Btn>
            )}
          </div>
        </form>
      </CC>
    </Card>
  )

  const renderPatients = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <Msg {...msg} />
      <Card>
        <CardH>
          <CT>Patient Management</CT>
        </CardH>
        <CC>
          <Lbl htmlFor="selPat">Select Patient</Lbl>
          <Sel
            id="selPat"
            value={selectedPatient}
            onChange={(e) => {
              setSelectedPatient(e.target.value)
              setAction('')
            }}
          >
            <option value="">Choose a patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </Sel>
          {selectedPatient && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {[
                { id: 'prescribe', label: '💊 Prescriptions', icon: null },
                { id: 'schedule', label: '📅 Schedule', icon: null },
                { id: 'record', label: '📋 Add Record', icon: null }
              ].map((a) => (
                <Btn
                  key={a.id}
                  variant={action === a.id ? 'primary' : 'outline'}
                  onClick={() => setAction(a.id)}
                  className="text-sm"
                >
                  {a.label}
                </Btn>
              ))}
            </div>
          )}
        </CC>
      </Card>

      {/* Patient history */}
      {selectedPatient && patientHistory && (
        <Card>
          <CardH icon={History}>
            <CT>Patient Full History</CT>
          </CardH>
          <CC>
            <div className="space-y-3">
              {patientHistory.records?.length === 0 &&
              patientHistory.prescriptions?.length === 0 ? (
                <p className="text-gray-500 text-sm">No records yet.</p>
              ) : (
                <>
                  {patientHistory.records?.slice(0, 5).map((r, i) => (
                    <div key={i} className="py-2 border-b last:border-0">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Dr. {r.doctorId?.firstName} {r.doctorId?.lastName} (
                          {r.doctorId?.specialty})
                        </span>
                        <span>
                          {new Date(r.visitDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      {r.diagnosis && (
                        <p className="text-sm">
                          <strong>Dx:</strong> {r.diagnosis}
                        </p>
                      )}
                      {r.treatment && (
                        <p className="text-sm">
                          <strong>Rx:</strong> {r.treatment}
                        </p>
                      )}
                    </div>
                  ))}
                  {patientHistory.upcomingAppointments?.map(
                    (a, i) =>
                      a.reports?.length > 0 && (
                        <div
                          key={i}
                          className="py-2 border-b bg-yellow-50 rounded p-2"
                        >
                          <p className="text-sm font-medium text-yellow-800">
                            📎 Patient uploaded {a.reports.length} report(s) for
                            upcoming appointment (
                            {new Date(a.date).toLocaleDateString('en-GB')})
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {a.reports.map((f, j) => (
                              <a
                                key={j}
                                href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${f.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 underline"
                              >
                                {f.originalName || f.filename}
                              </a>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </>
              )}
            </div>
          </CC>
        </Card>
      )}

      {/* ── Multi-medicine prescriptions panel ─────────────────────────────── */}
      {action === 'prescribe' && selectedPatient && renderPrescribePanel()}

      {/* Schedule appointment */}
      {action === 'schedule' && selectedPatient && (
        <Card>
          <CardH>
            <CT>Schedule Appointment</CT>
          </CardH>
          <CC>
            <form onSubmit={handleSchedule} className="space-y-3">
              <div>
                <Lbl>Date</Lbl>
                <Inp
                  type="date"
                  value={schedForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSchedForm((p) => ({
                      ...p,
                      patientId: selectedPatient,
                      date: e.target.value
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Lbl>Slot</Lbl>
                <Sel
                  value={schedForm.queueNumber}
                  onChange={(e) => {
                    const slot = slots.find(
                      (s) => s.queueNumber === parseInt(e.target.value)
                    )
                    if (slot)
                      setSchedForm((p) => ({
                        ...p,
                        queueNumber: slot.queueNumber,
                        estimatedTime: slot.estimatedTime,
                        tokenCode: slot.tokenCode
                      }))
                  }}
                  required
                  disabled={slots.length === 0}
                >
                  <option value="">
                    {slots.length === 0 ? 'Choose date first' : 'Choose slot'}
                  </option>
                  {slots.map((s) => (
                    <option key={s.queueNumber} value={s.queueNumber}>
                      Token {s.tokenCode} — {s.estimatedTime12h}
                    </option>
                  ))}
                </Sel>
              </div>
              <div>
                <Lbl>Reason</Lbl>
                <Inp
                  value={schedForm.reason}
                  onChange={(e) =>
                    setSchedForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  placeholder="Reason for visit"
                  required
                />
              </div>
              <Btn type="submit">Schedule</Btn>
            </form>
          </CC>
        </Card>
      )}

      {/* Add medical record */}
      {action === 'record' && selectedPatient && (
        <Card>
          <CardH icon={ClipboardList}>
            <CT>Add Medical Record</CT>
          </CardH>
          <CC>
            <form onSubmit={handleSaveRecord} className="space-y-3">
              <div>
                <Lbl>Link to Appointment (optional)</Lbl>
                <Sel
                  value={recForm.appointmentId}
                  onChange={(e) =>
                    setRecForm((p) => ({ ...p, appointmentId: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {todayAppts
                    .filter(
                      (a) =>
                        a.patientId?._id === selectedPatient ||
                        a.patientId === selectedPatient
                    )
                    .map((a) => (
                      <option key={a._id} value={a._id}>
                        Today {a.tokenCode} — {a.reason}
                      </option>
                    ))}
                </Sel>
              </div>
              <div>
                <Lbl>Chief Complaint</Lbl>
                <Inp
                  value={recForm.chiefComplaint}
                  onChange={(e) =>
                    setRecForm((p) => ({
                      ...p,
                      chiefComplaint: e.target.value
                    }))
                  }
                  placeholder="Patient's main complaint"
                />
              </div>
              <div>
                <Lbl>Diagnosis</Lbl>
                <Inp
                  value={recForm.diagnosis}
                  onChange={(e) =>
                    setRecForm((p) => ({ ...p, diagnosis: e.target.value }))
                  }
                  placeholder="Diagnosis"
                />
              </div>
              <div>
                <Lbl>Treatment</Lbl>
                <Inp
                  value={recForm.treatment}
                  onChange={(e) =>
                    setRecForm((p) => ({ ...p, treatment: e.target.value }))
                  }
                  placeholder="Treatment plan"
                />
              </div>
              <div>
                <Lbl>Notes</Lbl>
                <Inp
                  value={recForm.notes}
                  onChange={(e) =>
                    setRecForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Additional notes"
                />
              </div>
              <Btn type="submit">Save Record</Btn>
            </form>
          </CC>
        </Card>
      )}
    </div>
  )

  const renderHistory = () => (
    <Card className="max-w-4xl mx-auto">
      <CardH icon={History}>
        <CT>All Appointment Records</CT>
      </CardH>
      <CC>
        {allAppts.length === 0 ? (
          <p className="text-gray-500 text-sm">No records.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Patient</th>
                  <th className="pb-2 pr-4">Token</th>
                  <th className="pb-2 pr-4">Reason</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {allAppts.map((a, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-4">
                      {new Date(a.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 pr-4">
                      {a.patientId?.firstName} {a.patientId?.lastName}
                    </td>
                    <td className="py-2 pr-4 font-bold text-blue-700">
                      {a.tokenCode}
                    </td>
                    <td className="py-2 pr-4 max-w-xs truncate">{a.reason}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${a.visitType === 'follow-up' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {a.visitType}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${a.status === 'completed' ? 'bg-green-100 text-green-700' : a.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CC>
    </Card>
  )

  return (
    <div className="min-h-screen bg-blue-600">
      <header className="bg-white p-4 flex justify-between items-center shadow">
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Hospital Management System</span>
        </div>
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50"
        >
          Sign Out
        </button>
      </header>
      <nav className="bg-blue-700 p-3">
        <ul className="flex space-x-2 justify-center flex-wrap gap-y-2">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-600'}`}
              >
                <t.icon className="w-4 h-4 mr-2" />
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome, Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}
        </h1>
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Profile' && renderProfile()}
        {activeTab === 'Queue' && renderQueue()}
        {activeTab === 'Patients' && renderPatients()}
        {activeTab === 'History' && renderHistory()}
      </main>
    </div>
  )
}
