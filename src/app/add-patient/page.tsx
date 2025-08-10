'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { patientService, CreatePatientData } from '@/lib/patient-service';
import { UserRole } from '@/lib/user-roles';
import RestrictionPopup from '@/components/RestrictionPopup';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import RoleGuard from '@/components/RoleGuard';
import BrandButton from '@/components/BrandButton';
import BrandLoader from '@/components/BrandLoader';
import InlineLoader from '@/components/InlineLoader';

// Patient number generation is now handled automatically by the patient service

export default function AddPatientPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showRestrictionPopup, setShowRestrictionPopup] = useState(false);

  const [formData, setFormData] = useState<CreatePatientData>({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    healthCareInsurance: '',
    email: '',
    phone: '',
    patientId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (!authLoading && user && userRole === UserRole.SURGICAL_TEAM) {
      // Surgical Team cannot add patients - show restriction popup
      setShowRestrictionPopup(true);
    }
  }, [user, userRole, authLoading, router]);

  // Client-side validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // First Name validation
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First Name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First Name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last Name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last Name must be at least 2 characters';
    }

    // Date of Birth validation
    if (!formData.dob?.trim()) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate > today) {
        newErrors.dob = 'Date of Birth cannot be in the future';
      }
    }

    // Address validation
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    // Health Care Insurance validation
    if (!formData.healthCareInsurance?.trim()) {
      newErrors.healthCareInsurance = 'Health Care Insurance is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Patient number will be generated automatically by the service
      await patientService.addPatient({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        dateOfBirth: formData.dob,
      });

      setSuccess(true);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        healthCareInsurance: '',
        email: '',
        phone: '',
        patientId: '',
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/patients');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <RoleGuard requiredRole={UserRole.ADMIN}>
      {loading && <BrandLoader fullScreen message="Saving patient..." />}
      <Box sx={{ p: 3 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/patients" style={{ textDecoration: 'none', color: 'inherit' }}>
            Patients
          </Link>
          <Typography color="text.primary">Add Patient</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            component={Link}
            href="/patients"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back to Patients
          </Button>
          <Typography variant="h4" component="h1">
            Add New Patient
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Patient added successfully! Redirecting to patients list...
          </Alert>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {/* First Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ flex: '1 1 300px', minWidth: 0 }}
                  >
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      required
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#07BEB8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07BEB8',
                          },
                        },
                      }}
                    />
                  </motion.div>

                  {/* Last Name */}
                  <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      required
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#07BEB8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07BEB8',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Date of Birth */}
                  <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      error={!!errors.dob}
                      helperText={errors.dob}
                      required
                      disabled={loading}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#07BEB8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07BEB8',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Phone Number */}
                  <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      required
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#07BEB8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07BEB8',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Address */}
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      error={!!errors.address}
                      helperText={errors.address}
                      required
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#07BEB8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07BEB8',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Health Care Insurance */}
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      label="Health Care Insurance"
                      name="healthCareInsurance"
                      value={formData.healthCareInsurance}
                      onChange={handleChange}
                      error={!!errors.healthCareInsurance}
                      helperText={errors.healthCareInsurance}
                      required
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#07BEB8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07BEB8',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Email */}
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#07BEB8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#07BEB8',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Submit Buttons */}
                  <Box sx={{ flex: '1 1 100%' }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        component={Link}
                        href="/patients"
                        disabled={loading}
                        sx={{
                          borderRadius: '50px',
                          px: 4,
                          py: 1,
                          minHeight: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#07BEB8',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          textTransform: 'none',
                          fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                          letterSpacing: '0.5px',
                          textAlign: 'center',
                          boxShadow: '0 4px 12px rgba(7, 190, 184, 0.3)',
                          '&:hover': {
                            background: '#059B96',
                            boxShadow: '0 6px 20px rgba(7, 190, 184, 0.4)',
                            transform: 'translateY(-1px)'
                          },
                          '&:focus': {
                            boxShadow: '0 0 0 3px rgba(7, 190, 184, 0.2), 0 4px 12px rgba(7, 190, 184, 0.3)'
                          },
                          '&:active': {
                            transform: 'translateY(0px)',
                            boxShadow: '0 2px 8px rgba(7, 190, 184, 0.3)'
                          },
                          '&:disabled': {
                            background: '#9CA3AF',
                            color: 'rgba(255, 255, 255, 0.6)',
                            boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                            transform: 'none'
                          },
                          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      >
                        Cancel
                      </Button>
                      <BrandButton
                        type="submit"
                        startIcon={loading ? <InlineLoader size={20} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Patient'}
                      </BrandButton>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </Box>

      {/* Restriction Popup for Surgical Team */}
      <RestrictionPopup
        open={showRestrictionPopup}
        onClose={() => setShowRestrictionPopup(false)}
        title="Access Restricted"
        message="As a Surgical Team member, you cannot add new patients. This functionality is restricted to administrators only. Please contact your administrator if you need to add a patient."
      />
    </RoleGuard>
  );
}
