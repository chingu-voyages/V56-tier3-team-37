'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { patientService, CreatePatientData } from '@/lib/patient-service';
import { UserRole } from '@/lib/user-roles';
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

function generatePatientNumber() {
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.substring(0, 6).toUpperCase();
}

export default function AddPatientPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreatePatientData>({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    healthCareInsurance: '',
    email: '',
    phone: '',
    patientNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

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
      const patientId = uuidv4();

      // Generate a unique patient number
      let patientNumber = generatePatientNumber();
      let attempts = 0;
      const maxAttempts = 10;

      // Keep generating until we get a unique number or reach max attempts
      while (await patientService.checkPatientNumberExists(patientNumber) && attempts < maxAttempts) {
        patientNumber = generatePatientNumber();
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Unable to generate unique patient number. Please try again.');
      }

      await patientService.addPatient({
        ...formData,
        patientNumber,
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
        patientNumber: '',
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
                    />
                  </Box>

                  {/* Submit Buttons */}
                  <Box sx={{ flex: '1 1 100%' }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        component={Link}
                        href="/patients"
                        disabled={loading}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          borderColor: '#07BEB8',
                          color: '#07BEB8',
                          '&:hover': {
                            borderColor: '#059B96',
                            backgroundColor: 'rgba(7, 190, 184, 0.04)'
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <BrandButton
                        type="submit"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
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
    </RoleGuard>
  );
}
