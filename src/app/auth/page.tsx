'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push('/patients');
    } catch (err: any) {
      // Firebase error handling - COMMENTED OUT FOR SKELETON
      // In the real app, Firebase would throw authentication errors here
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="card card--form">
        <div className="card__body">
          <h2 className="card__title text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>       
              
          {error && (
            <div className="alert alert--error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="form__group">
              <label className="form__label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="form__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="form__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form__group">
              <button
                type="submit"
                className={`form__button form__button--primary form__button--wide ${loading ? 'form__button--loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <button
              className="form__button form__button--outline form__button--wide"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Create new account' : 'Already have an account?'}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="form__button form__button--outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 