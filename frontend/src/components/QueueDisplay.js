import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Hospital, Users, Clock } from 'lucide-react'

const POLL_INTERVAL = 15000 // 15 seconds

export default function QueueDisplay() {
  const { doctorId } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/queue/${doctorId}`
      )
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
      setLastUpdate(new Date())
      setError('')
    } catch (err) {
      setError('Unable to load queue data. Retrying...')
    }
  }, [doctorId])

  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchQueue])

  if (error && !data) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <p className="text-white text-2xl">{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <p className="text-white text-2xl animate-pulse">Loading queue...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Hospital className="h-8 w-8" />
          <span className="text-2xl font-bold">Hospital Management System</span>
        </div>
        <div className="text-right text-sm text-blue-300">
          <p>{data.doctor.name}</p>
          <p>{data.doctor.specialty}</p>
          <p>Hours: {data.doctor.hours}</p>
        </div>
      </header>

      {/* Main Display */}
      <main className="flex-1 flex flex-col items-center justify-center gap-10 p-8">
        {/* NOW SERVING */}
        <div className="bg-blue-700 rounded-2xl shadow-2xl p-10 text-center w-full max-w-lg border-4 border-green-400">
          <p className="text-green-300 text-2xl font-semibold uppercase tracking-widest mb-4">
            Now Serving
          </p>
          {data.current ? (
            <>
              <p className="text-9xl font-black text-white leading-none">
                {data.current.tokenCode}
              </p>
              <p className="text-4xl text-blue-200 mt-4">
                Queue #{data.current.queueNumber}
              </p>
            </>
          ) : (
            <p className="text-5xl text-blue-300 italic">—</p>
          )}
        </div>

        {/* NEXT */}
        <div className="bg-blue-800 rounded-2xl shadow-xl p-8 text-center w-full max-w-lg border-2 border-blue-400">
          <p className="text-blue-300 text-xl font-semibold uppercase tracking-widest mb-3">
            Next
          </p>
          {data.next ? (
            <>
              <p className="text-7xl font-bold text-white">
                {data.next.tokenCode}
              </p>
              <p className="text-2xl text-blue-300 mt-2">
                Est. {data.next.estimatedTime}
              </p>
            </>
          ) : (
            <p className="text-3xl text-blue-400 italic">No more patients</p>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex gap-8">
          <div className="flex items-center gap-2 bg-blue-800 px-6 py-3 rounded-xl">
            <Users className="h-5 w-5 text-blue-300" />
            <span className="text-blue-200">
              Waiting:{' '}
              <strong className="text-white">{data.remainingCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-800 px-6 py-3 rounded-xl">
            <Clock className="h-5 w-5 text-blue-300" />
            <span className="text-blue-200">
              Completed:{' '}
              <strong className="text-white">{data.completedCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-800 px-6 py-3 rounded-xl">
            <span className="text-blue-200">
              Total Today:{' '}
              <strong className="text-white">{data.totalToday}</strong>
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 px-8 py-3 text-center text-blue-400 text-sm">
        {lastUpdate && (
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        )}
        {error && <span className="text-yellow-400 ml-4">{error}</span>}
      </footer>
    </div>
  )
}
