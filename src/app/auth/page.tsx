'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
import BrandButton from '@/components/BrandButton';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn } = useAuth();
  const router = useRouter();

  // Client-side validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/patients');
    } catch (err: any) {
      // Handle Firebase authentication errors
      let errorMessage = 'Invalid username/password';

      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid username/password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later';
            break;
          default:
            errorMessage = 'Invalid username/password';
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
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Box component="form" onSubmit={handleSubmit} className="auth-page__form">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
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
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors(prev => ({ ...prev, password: '' }));
                          }
                        }}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        className="auth-page__input"
                        InputProps={{
                          startAdornment: <LockIcon className="auth-page__input-icon" />,
                        }}
                      />

                      <BrandButton
                        type="submit"
                        fullWidth
                        size="large"
                        disabled={loading}
                        className="auth-page__submit-button"
                        startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                      >
                        {loading ? 'Processing...' : 'Sign In'}
                      </BrandButton>
                    </motion.div>
                  </Box>
                </motion.div>

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
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
} 