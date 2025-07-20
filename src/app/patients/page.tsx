'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PatientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const patients = [
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      phone: '+1 (555) 234-5678',
      email: 'jane.smith@email.com',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      age: 58,
      gender: 'Male',
      phone: '+1 (555) 345-6789',
      email: 'bob.johnson@email.com',
      status: 'Inactive'
    }
  ];

  return (
    <div className="container">
      <div className="py-8">
        <div className="flex flex--between items-center mb-8">
          <h1 className="text-4xl font-bold">Patients</h1>
          <Link href="/add-patient" className="form__button form__button--primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Patient
          </Link>
        </div>

        {/* Firebase Notice */}
        <div className="alert alert--info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>
            <strong>Demo Mode:</strong> This is static demo data. In a real app, this would be fetched from Firebase Firestore.
          </span>
        </div>

        <div className="card">
          <div className="card__body">
            <h2 className="card__title">Patient List</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table__header">
                  <tr className="table__row">
                    <th className="table__cell table__cell--header">Name</th>
                    <th className="table__cell table__cell--header">Age</th>
                    <th className="table__cell table__cell--header">Gender</th>
                    <th className="table__cell table__cell--header">Phone</th>
                    <th className="table__cell table__cell--header">Email</th>
                    <th className="table__cell table__cell--header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="table__row">
                      <td className="table__cell font-semibold">{patient.name}</td>
                      <td className="table__cell">{patient.age}</td>
                      <td className="table__cell">{patient.gender}</td>
                      <td className="table__cell">{patient.phone}</td>
                      <td className="table__cell">{patient.email}</td>
                      <td className="table__cell">
                        <div className={`badge ${patient.status === 'Active' ? 'badge--success' : 'badge--neutral'}`}>
                          {patient.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-4">
            This is demo data. In a real app, this would be fetched from a database.
          </p>
          <Link href="/" className="form__button form__button--outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 