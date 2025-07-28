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

export default function AddPatientPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (field: keyof CreatePatientData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  );
} 