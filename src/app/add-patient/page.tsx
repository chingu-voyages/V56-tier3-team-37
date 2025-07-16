'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AddPatientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Simulate form submission
    // In a real app, this would save to Firebase Firestore
    setTimeout(() => {
      setMessage('Patient added successfully! (This is a demo - no data is actually saved)');
      setIsSubmitting(false);
      setFormData({
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: ''
      });
    }, 1000);
  };

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

  return (
    <div className="container">
      <div className="py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex--between items-center mb-8">
            <h1 className="text-4xl font-bold">Add New Patient</h1>
            <Link href="/patients" className="form__button form__button--outline">
              Back to Patients
            </Link>
          </div>

          {/* Firebase Notice */}
          <div className="alert alert--info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            </div>

          <div className="card card--form">
            <div className="card__body">
              <h2 className="card__title">Patient Information</h2>
              
              {message && (
                <div className="alert alert--success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="form">
                <div className="grid grid--2-col">
                  <div className="form__group">
                    <label className="form__label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter patient's full name"
                      className="form__input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form__group">
                    <label className="form__label">Age *</label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Enter age"
                      className="form__input"
                      value={formData.age}
                      onChange={handleChange}
                      min="0"
                      max="150"
                      required
                    />
                  </div>

                  <div className="form__group">
                    <label className="form__label">Gender *</label>
                    <select
                      name="gender"
                      className="form__select"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form__group">
                    <label className="form__label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      className="form__input"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form__group">
                  <label className="form__label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="form__input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form__group">
                  <button
                    type="submit"
                    className={`form__button form__button--primary form__button--wide ${isSubmitting ? 'form__button--loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding Patient...' : 'Add Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">
              This is a demo form. In a real app, this data would be saved to a database.
            </p>
            <Link href="/" className="form__button form__button--outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 