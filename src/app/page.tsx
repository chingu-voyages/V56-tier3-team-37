'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  return (
    <div>
    {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Surgery Status App</h1>
          <p className="hero__description">
            A simple skeleton app demonstrating Next.js routing, Firebase authentication, 
            and daisyUI components. Learn how to build modern web applications.
          </p>
          <div className="hero__actions">
            {user ? (
              <>
                <Link href="/patients" className="form__button form__button--primary form__button--wide">
                  View Patients
                </Link>
                <Link href="/add-patient" className="form__button form__button--secondary form__button--wide">
                  Add New Patient
                </Link>
              </>
            ) : (
              <Link href="/auth" className="form__button form__button--primary form__button--wide">
                Get Started - Login
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="bg-gray-50">
        <div className="container">
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Quick Start Guide</h2>
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="card">
                  <div className="card__body">
                    <h3 className="card__title">1. Authentication</h3>
                    <p className="card__content">Start by creating an account or logging in to access the app features.</p>
                    <div className="card__actions">
                      <Link href="/auth" className="form__button form__button--primary">
                        Go to Auth
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card__body">
                    <h3 className="card__title">2. View Patients</h3>
                    <p className="card__content">After logging in, you can view the list of patients (demo data).</p>
                    <div className="card__actions">
                      <Link href="/patients" className="form__button form__button--primary">
                        View Patients
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card__body">
                    <h3 className="card__title">3. Add Patient</h3>
                    <p className="card__content">Learn how to create forms and handle user input with a simple patient form.</p>
                    <div className="card__actions">
                      <Link href="/add-patient" className="form__button form__button--primary">
                        Add Patient
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
