'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { patientService, CreatePatientData, Patient } from '@/lib/patient-service';
import { UserRole } from '@/lib/user-roles';
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

// ✅ Required by static export
export async function generateStaticParams() {
  const patients = await patientService.getPatients();
  return patients.map((p) => ({ id: p.id }));
}

export default async function EditPatientPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const patientId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingPatient, setFetchingPatient] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patient, setPatient] = useState<Patient | null>(null);

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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user && patientId) {
      fetchPatient();
    }
  }, [user, authLoading, router, patientId]);

  const fetchPatient = async () => {
    try {
      setFetchingPatient(true);
      setError('');

      // Get all patients and find the one with matching ID
      const patients = await patientService.getPatients();
      const foundPatient = patients.find(p => p.id === patientId);

      if (!foundPatient) {
        setError('Patient not found');
        return;
      }

      setPatient(foundPatient);

      // Populate form with existing data
      setFormData({
        name: foundPatient.name || '',
        email: foundPatient.email || '',
        phone: foundPatient.phone || '',
        dateOfBirth: foundPatient.dateOfBirth || '',
        surgeryType: foundPatient.surgeryType || '',
        surgeryDate: foundPatient.surgeryDate || '',
        status: foundPatient.status || 'scheduled',
        notes: foundPatient.notes || ''
      });
    } catch (err: any) {
      console.error('Fetch Patient Error:', err);
      setError(err.message || 'Failed to fetch patient data');
    } finally {
      setFetchingPatient(false);
    }
  };

  // Client-side validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Surgery type validation
    if (!formData.surgeryType?.trim()) {
      newErrors.surgeryType = 'Surgery type is required';
    }

    // Surgery date validation
    if (!formData.surgeryDate) {
      newErrors.surgeryDate = 'Surgery date is required';
    } else {
      const surgeryDate = new Date(formData.surgeryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (surgeryDate < today) {
        newErrors.surgeryDate = 'Surgery date cannot be in the past';
      }
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof CreatePatientData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await patientService.updatePatient(patientId, formData);
      setSuccess(true);

      // Redirect after delay
      setTimeout(() => {
        router.push(`/patients/`);
      }, 2000);
    } catch (err: any) {
      console.error('Update Patient Error:', err);
      setError(err.message || 'Failed to update patient');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingPatient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  if (error && !patient) {
    return (
      <RoleGuard requiredRole={UserRole.SURGICAL_TEAM}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            component={Link}
            href="/patients"
            startIcon={<ArrowBackIcon />}
          >
            Back to Patients
          </Button>
        </Box>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard requiredRole={UserRole.SURGICAL_TEAM}>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/patients" style={{ textDecoration: 'none', color: 'inherit' }}>
            Patients
          </Link>
          <Typography color="text.primary">Edit Patient</Typography>
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
          <Box>
            <Typography variant="h4" component="h1">
              Edit Patient
            </Typography>
            {patient && (
              <Typography variant="subtitle1" color="text.secondary">
                Patient ID: {patient.id}
              </Typography>
            )}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Patient updated successfully! Redirecting to patients list...
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
                    error={!!errors.name}
                    helperText={errors.name}
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
                    error={!!errors.email}
                    helperText={errors.email}
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
                    error={!!errors.phone}
                    helperText={errors.phone}
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
                    error={!!errors.surgeryType}
                    helperText={errors.surgeryType}
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
                    error={!!errors.surgeryDate}
                    helperText={errors.surgeryDate}
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
                      {loading ? 'Updating...' : 'Update Patient'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </RoleGuard>
  );
}