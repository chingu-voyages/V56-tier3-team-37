import { useState } from 'react'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Patient, SurgeryStatus } from '@/lib/patient-context'



interface Props {
  patient: Patient
}

const STATUS_OPTIONS: SurgeryStatus[] = [
  'Checked In',
  'Pre-Procedure',
  'In-Progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
]

export function PatientStatusForm({ patient }: Props) {
  const [status, setStatus] = useState(patient.status)
  const [message, setMessage] = useState('')

  const currentIndex = STATUS_OPTIONS.indexOf(status)

  const validOptions = STATUS_OPTIONS.filter((_, idx) =>
    idx === currentIndex || idx === currentIndex + 1 || idx === currentIndex - 1
  )

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newValue = e.target.value

  if (isSurgeryStatus(newValue)) {
    updateStatus(newValue)
  } else {
    setMessage('Invalid status selected.')
  }
}

const isSurgeryStatus = (value: string): value is SurgeryStatus => {
  return [
    'Checked In',
    'Pre-Procedure',
    'In-Progress',
    'Closing',
    'Recovery',
    'Complete',
    'Dismissal',
  ].includes(value as SurgeryStatus)
}

  const updateStatus = async (newStatus: SurgeryStatus) => {
    try {
      const docRef = doc(db, 'patients', patient.id)
      await updateDoc(docRef, { status: newStatus })
      setStatus(newStatus)
      setMessage('Status updated!')
    } catch (err) {
      setMessage('Failed to update.')
    }
  }

  return (
    <div className="mt-4 border p-4 rounded bg-gray-100">
      <h2 className="text-lg font-semibold mb-2">Patient Info</h2>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Address:</strong> {patient.address}</p>
      <p><strong>Contact:</strong> {patient.contact}</p>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Current Status:</label>
        <p className="mb-2">{status}</p>

        <select
          className="border p-2 w-full"
          value={status}
          onChange={handleStatusChange}
        >
          {validOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
    </div>
  )
}