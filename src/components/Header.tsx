'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__navbar">
          <div className="header__brand">
            <Link href="/" className="header__nav-item">Surgery Status</Link>
          </div>
          
          <nav className="header__nav">
            <Link href="/" className="header__nav-item">Home</Link>
            {user && (
              <>
                <Link href="/patients" className="header__nav-item">Patients</Link>
                <Link href="/add-patient" className="header__nav-item">Add Patient</Link>
              </>
            )}
          </nav>
          
          <div className="header__user-menu">
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="header__avatar">
                  <img alt="User" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
                <ul tabIndex={0} className="header__dropdown">
                  <li><span className="header__dropdown-item">Welcome, {user.email}</span></li>
                  <li><button onClick={handleLogout} className="header__dropdown-item">Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/auth" className="header__nav-item">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 