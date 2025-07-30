'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { patientService, Patient } from '@/lib/patient-service';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

export default function PatientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      fetchPatients();
    }
  }, [user, authLoading, router]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString();
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
          border: '1px solid rgba(7, 190, 184, 0.1)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#1F2937',
                  mb: 1,
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                }}
              >
                Patient Management
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  fontSize: '1.1rem'
                }}
              >
                Manage and monitor patient information and surgery status
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchPatients}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  borderColor: '#07BEB8',
                  color: '#07BEB8',
                  '&:hover': {
                    borderColor: '#059B96',
                    backgroundColor: 'rgba(7, 190, 184, 0.05)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                href="/add-patient"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                  boxShadow: '0 4px 15px rgba(7, 190, 184, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)',
                    boxShadow: '0 6px 20px rgba(7, 190, 184, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add Patient
              </Button>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: '1px solid rgba(239, 68, 68, 0.2)',
              '& .MuiAlert-icon': {
                color: '#DC2626'
              }
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
                color: '#07BEB8',
                mb: 2
              }}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}
            >
              Loading patients...
            </Typography>
          </Box>
        ) : patients.length === 0 ? (
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(7, 190, 184, 0.1)'
          }}>
            <CardContent sx={{
              textAlign: 'center',
              py: 8,
              px: 4
            }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: '0 4px 15px rgba(7, 190, 184, 0.3)'
              }}>
                <AddIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
              <Typography
                variant="h5"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  mb: 2
                }}
              >
                No patients found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  maxWidth: 400,
                  margin: '0 auto 2rem'
                }}
              >
                Start by adding your first patient to the system. You'll be able to track their surgery status and provide real-time updates.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                href="/add-patient"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                  boxShadow: '0 4px 15px rgba(7, 190, 184, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)',
                    boxShadow: '0 6px 20px rgba(7, 190, 184, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add First Patient
              </Button>
            </CardContent>
          </Card>
        ) : (
          <MuiPaper sx={{
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(7, 190, 184, 0.1)'
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(7, 190, 184, 0.05)' }}>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)'
                    }}>
                      Name
                    </TableCell>
                     <TableCell sx={{
                      fontWeight: 600, 
                      color: '#1F2937', 
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif', 
                      fontSize: '0.95rem', 
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)' 
                      }}>
                        Patient ID
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)'
                    }}>
                      Email
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)'
                    }}>
                      Phone
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)'
                    }}>
                      Surgery Type
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)'
                    }}>
                      Surgery Date
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)'
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid rgba(7, 190, 184, 0.2)'
                    }}>
                      Created
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient, index) => (
                    <TableRow
                      key={patient.id}
                      hover
                      sx={{
                        backgroundColor: index % 2 === 0 ? 'white' : 'rgba(7, 190, 184, 0.02)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(7, 190, 184, 0.05)',
                          transform: 'scale(1.001)'
                        }
                      }}
                    >
                      <TableCell sx={{
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        fontWeight: 500
                      }}>
                        <Typography variant="body2" fontWeight="600" color="#1F2937">
                          {patient.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        color: '#6B7280'
                      }}>
                        {patient.id}
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        color: '#6B7280'
                      }}>
                        {patient.email}
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        color: '#6B7280'
                      }}>
                        {patient.phone}
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        fontWeight: 500
                      }}>
                        {patient.surgeryType}
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        color: '#6B7280'
                      }}>
                        {formatDate(patient.surgeryDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={patient.status.replace('-', ' ')}
                          color={getStatusColor(patient.status)}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            borderRadius: 1.5,
                            fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                            '&.MuiChip-colorPrimary': {
                              backgroundColor: '#07BEB8',
                              color: 'white'
                            },
                            '&.MuiChip-colorWarning': {
                              backgroundColor: '#F59E0B',
                              color: 'white'
                            },
                            '&.MuiChip-colorSuccess': {
                              backgroundColor: '#10B981',
                              color: 'white'
                            },
                            '&.MuiChip-colorError': {
                              backgroundColor: '#EF4444',
                              color: 'white'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        color: '#6B7280',
                        fontSize: '0.875rem'
                      }}>
                        {patient.createdAt instanceof Date
                          ? formatDate(patient.createdAt.toDate().toISOString())
                          : formatDate(patient.createdAt.toDate().toISOString())
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MuiPaper>
        )}
      </Box>
    </RoleGuard>
  );
} 