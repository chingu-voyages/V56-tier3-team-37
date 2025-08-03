'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { patientService, CreatePatientData } from '@/lib/patient-service';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import RoleGuard from '@/components/RoleGuard';

function generatePatientId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export default function AddPatientPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
<<<<<<< Updated upstream
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreatePatientData>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    surgeryType: '',
    surgeryDate: '',
    status: 'scheduled',
    notes: ''
  });
=======

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    healthCareInsurance: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
>>>>>>> Stashed changes

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

<<<<<<< Updated upstream
  const handleInputChange = (field: keyof CreatePatientData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
=======
  // Client-side validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.dob.trim()) newErrors.dob = 'Date of Birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.healthCareInsurance.trim()) newErrors.healthCareInsurance = 'Health Care Insurance is required';

    if (formData.email) {
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    } else {
      newErrors.email = 'Email is required';
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
>>>>>>> Stashed changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< Updated upstream
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Basic validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.phone.trim()) {
        throw new Error('Phone is required');
      }
      if (!formData.surgeryType.trim()) {
        throw new Error('Surgery type is required');
      }
      if (!formData.surgeryDate) {
        throw new Error('Surgery date is required');
      }

      await patientService.addPatient(formData);
      setSuccess(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        surgeryType: '',
        surgeryDate: '',
        status: 'scheduled',
        notes: ''
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/patients');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to add patient');
    } finally {
      setLoading(false);
=======

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setMessage('');

    try {
      const patientId = generatePatientId();
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, patientId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add patient');
      }

      setMessage('Patient added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        healthCareInsurance: '',
        email: '',
        phone: '',
      });
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    <RoleGuard requiredRole="admin">
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    disabled={loading}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    disabled={loading}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    required
                    disabled={loading}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange('dateOfBirth')}
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Surgery Type"
                    value={formData.surgeryType}
                    onChange={handleInputChange('surgeryType')}
                    required
                    disabled={loading}
                    placeholder="e.g., Appendectomy, Heart Surgery"
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Surgery Date"
                    type="date"
                    value={formData.surgeryDate}
                    onChange={handleInputChange('surgeryDate')}
                    required
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange('notes')}
                    disabled={loading}
                    placeholder="Additional notes about the patient or surgery..."
                  />
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      component={Link}
                      href="/patients"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Patient'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </RoleGuard>
=======
    <div className="container">
      <div className="py-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Add New Patient</h1>
          <Link href="/patients" className="form__button form__button--outline">
            Back to Patients
          </Link>
        </div>

        {message && (
          <div
            className={`alert ${
              message.includes('successfully') ? 'alert--success' : 'alert--error'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="form__group">
              <label className="form__label" htmlFor="firstName">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                className={`form__input ${errors.firstName ? 'border-red-500' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="form__group">
              <label className="form__label" htmlFor="lastName">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                className={`form__input ${errors.lastName ? 'border-red-500' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
            </div>

            {/* DOB */}
            <div className="form__group">
              <label className="form__label" htmlFor="dob">
                Date of Birth *
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                className={`form__input ${errors.dob ? 'border-red-500' : ''}`}
                value={formData.dob}
                onChange={handleChange}
                required
              />
              {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}
            </div>

            {/* Phone */}
            <div className="form__group">
              <label className="form__label" htmlFor="phone">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className={`form__input ${errors.phone ? 'border-red-500' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="form__group col-span-2">
              <label className="form__label" htmlFor="address">
                Address *
              </label>
              <input
                id="address"
                type="text"
                name="address"
                className={`form__input ${errors.address ? 'border-red-500' : ''}`}
                value={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
            </div>

            {/* Health Care Insurance */}
            <div className="form__group col-span-2">
              <label className="form__label" htmlFor="healthCareInsurance">
                Health Care Insurance *
              </label>
              <input
                id="healthCareInsurance"
                type="text"
                name="healthCareInsurance"
                className={`form__input ${errors.healthCareInsurance ? 'border-red-500' : ''}`}
                value={formData.healthCareInsurance}
                onChange={handleChange}
                required
              />
              {errors.healthCareInsurance && (
                <p className="text-red-600 text-sm">{errors.healthCareInsurance}</p>
              )}
            </div>

            {/* Email */}
            <div className="form__group col-span-2">
              <label className="form__label" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form__input ${errors.email ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>
          </div>

          <div className="form__group mt-6">
            <button
              type="submit"
              className={`form__button form__button--primary form__button--wide ${
                isSubmitting ? 'form__button--loading' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Patient...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
>>>>>>> Stashed changes
  );
}
