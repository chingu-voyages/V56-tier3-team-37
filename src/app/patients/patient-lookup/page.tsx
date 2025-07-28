'use client'

import { useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { PatientStatusForm } from '@/components/PatientStatusForm'

export default function PatientLookup() {
  const [code, setCode] = useState('')
  const [patient, setPatient] = useState(null)
  const [error, setError] = useState('')

  const lookupPatient = async () => {
    try {
      const docRef = doc(db, 'patients', code)
      const snapshot = await getDoc(docRef)

      if (snapshot.exists()) {
        setPatient({ id: snapshot.id, ...snapshot.data() })
        setError('')
      } else {
        setError('Patient not found.')
        setPatient(null)
      }
    } catch (err) {
      setError('Lookup failed.')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Patient Status Update</h1>
      <input
        type="text"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 w-full mb-2"
        placeholder="Enter 6-digit code"
      />
      <button
        onClick={lookupPatient}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Lookup
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {patient && <PatientStatusForm patient={patient} />}
    </div>
  )
}