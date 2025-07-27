'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Login as LoginIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/patients');
    } catch (err: any) {
      // Handle Firebase authentication errors
      let errorMessage = 'An error occurred during authentication';

      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later';
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-page">
      <Container maxWidth="sm">
        <Box className="auth-page__container">
          {/* Main Auth Card */}
          <Card className="auth-page__card" elevation={8}>
            <CardContent className="auth-page__content">
              {/* Header */}
              <Box className="auth-page__header">
                <Box className="auth-page__icon-container">
                  <LoginIcon className="auth-page__icon" />
                </Box>
                <Typography variant="h4" component="h1" className="auth-page__title">
                  Welcome Back
                </Typography>
                <Typography variant="body1" className="auth-page__subtitle">
                  Sign in to access your Care Flow dashboard
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" className="auth-page__alert">
                  {error}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} className="auth-page__form">
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-page__input"
                  InputProps={{
                    startAdornment: <EmailIcon className="auth-page__input-icon" />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-page__input"
                  InputProps={{
                    startAdornment: <LockIcon className="auth-page__input-icon" />,
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  className="auth-page__submit-button"
                  startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                >
                  {loading ? 'Processing...' : 'Sign In'}
                </Button>
              </Box>

              {/* Back to Home Button */}
              <Box className="auth-page__actions">
                <Button
                  variant="text"
                  fullWidth
                  component={Link}
                  href="/"
                  className="auth-page__home-button"
                  startIcon={<HomeIcon />}
                >
                  Back to Home
                </Button>
              </Box>

              {/* Footer */}
              <Box className="auth-page__footer">
                <Typography variant="caption" color="textSecondary" align="center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
} 