'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { patientService, Patient } from '@/lib/patient-service';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export default function DeletePatientPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id');

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (!patientId) {
      router.push('/patients');
      return;
    }

    if (user && patientId) {
      fetchPatient();
    }
  }, [user, authLoading, router, patientId]);

  const fetchPatient = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      setError('');
      const patients = await patientService.getPatients();
      const foundPatient = patients.find(p => p.id === patientId);
      
      if (!foundPatient) {
        setError('Patient not found');
        return;
      }
      
      setPatient(foundPatient);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = () => {
    setConfirmDialogOpen(true);
    setDeleteError('');
  };

  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
    setDeleteError('');
  };

  const handleDeletePatient = async () => {
    if (!patient?.id) return;

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await patientService.deletePatient(patient.id);
      
      // Show success and redirect
      router.push('/patients');
    } catch (err: any) {
      console.error('Delete Patient Error:', err);
      setDeleteError(err.message || 'Failed to delete patient');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <RoleGuard requiredRole="surgical-team">
      <Box sx={{
        p: 4,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh'
      }}>
        {/* Page Header */}
        <Box sx={{
          background: 'white',
          borderRadius: 3,
          p: 4,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              component={Link}
              href="/patients"
              sx={{
                mr: 2,
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: 'rgba(107, 114, 128, 0.1)'
                }
              }}
            >
              Back to Patients
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}>
              <DeleteIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#DC2626',
                  mb: 1,
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                }}
              >
                Delete Patient
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  fontSize: '1.1rem'
                }}
              >
                Permanently remove patient from the system
              </Typography>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 8,
            background: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <CircularProgress
              size={60}
              sx={{
                color: '#EF4444',
                mb: 2
              }}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}
            >
              Loading patient details...
            </Typography>
          </Box>
        ) : !patient ? (
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <CardContent sx={{
              textAlign: 'center',
              py: 8,
              px: 4
            }}>
              <WarningIcon sx={{ fontSize: 80, color: '#EF4444', mb: 2 }} />
              <Typography
                variant="h5"
                color="error"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  mb: 2
                }}
              >
                Patient Not Found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                }}
              >
                The patient you're trying to delete could not be found.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/patients"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)'
                  }
                }}
              >
                Return to Patients
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Warning Alert */}
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{
                mb: 4,
                borderRadius: 2,
                border: '1px solid rgba(245, 158, 11, 0.2)',
                backgroundColor: 'rgba(254, 243, 199, 0.5)',
                '& .MuiAlert-icon': {
                  color: '#F59E0B'
                }
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Warning: This action cannot be undone
              </Typography>
              <Typography>
                Deleting this patient will permanently remove all their information from the system, 
                including medical records, surgery details, and historical data. Please ensure this 
                is the correct patient before proceeding.
              </Typography>
            </Alert>

            {/* Patient Details Card */}
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3
                  }}>
                    <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#1F2937',
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                      }}
                    >
                      {patient.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}
                    >
                      Patient ID: {patient.id}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Contact Information
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                      Email: {patient.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                      Phone: {patient.phone}
                    </Typography>
                    {patient.dateOfBirth && (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Date of Birth: {formatDate(patient.dateOfBirth)}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Surgery Information
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                      Surgery Type: {patient.surgeryType}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      Surgery Date: {formatDate(patient.surgeryDate)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Status:
                      </Typography>
                      <Chip
                        label={patient.status.replace('-', ' ')}
                        color={getStatusColor(patient.status)}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 600,
                          borderRadius: 1.5
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {patient.notes && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Notes
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {patient.notes}
                      </Typography>
                    </Box>
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Record Created
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {patient.createdAt instanceof Date
                      ? formatDate(patient.createdAt.toDate().toISOString())
                      : formatDate(patient.createdAt.toDate().toISOString())
                    }
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              p: 4,
              background: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <Button
                variant="outlined"
                component={Link}
                href="/patients"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  borderColor: '#6B7280',
                  color: '#6B7280',
                  '&:hover': {
                    borderColor: '#4B5563',
                    backgroundColor: 'rgba(107, 114, 128, 0.05)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteConfirm}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Delete Patient
              </Button>
            </Box>
          </>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pb: 2,
            borderBottom: '1px solid rgba(239, 68, 68, 0.1)'
          }}>
            <WarningIcon sx={{ color: '#EF4444', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#DC2626' }}>
                Confirm Patient Deletion
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {deleteError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {deleteError}
              </Alert>
            )}

            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you absolutely sure you want to delete this patient?
            </Typography>
            
            <Box sx={{
              p: 2,
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(239, 68, 68, 0.2)',
              mb: 2
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {patient?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: {patient?.id}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              This action will permanently delete all patient data including medical records, 
              surgery information, and historical data. This cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(239, 68, 68, 0.1)' }}>
            <Button
              onClick={handleDeleteCancel}
              disabled={deleteLoading}
              variant="outlined"
              sx={{
                borderColor: '#6B7280',
                color: '#6B7280',
                '&:hover': {
                  borderColor: '#4B5563',
                  backgroundColor: 'rgba(107, 114, 128, 0.05)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePatient}
              disabled={deleteLoading}
              variant="contained"
              startIcon={deleteLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
              sx={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                }
              }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Patient'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RoleGuard>
  );
}