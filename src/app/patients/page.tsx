'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { patientService, Patient, CreatePatientData } from '@/lib/patient-service';
import { UserRole } from '@/lib/user-roles';
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
  Paper as MuiPaper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

export default function PatientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deletedParam = searchParams.get('deleted');
  const [showDeletedAlert, setShowDeletedAlert] = useState(!!deletedParam);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [surgeryTypeFilter, setSurgeryTypeFilter] = useState<string>('all');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  const [editFormData, setEditFormData] = useState<CreatePatientData>({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    healthCareInsurance: '',
    email: '',
    phone: '',
    patientNumber: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      fetchPatients();
    }
  }, [user, authLoading, router]);

  // 👇 New alert dismiss logic
  useEffect(() => {
    if (showDeletedAlert) {
      const timeout = setTimeout(() => {
        setShowDeletedAlert(false);
      }, 3000); // Dismiss after 3 seconds

      return () => clearTimeout(timeout); // Cleanup if component unmounts
    }
  }, [showDeletedAlert]);

  // Add this filtered patients computation
  const filteredPatients = patients.filter(patient => {
    const fullName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      (patient.patientNumber && patient.patientNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.surgeryType && patient.surgeryType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesSurgeryType = surgeryTypeFilter === 'all' || patient.surgeryType === surgeryTypeFilter;

    return matchesSearch && matchesStatus && matchesSurgeryType;
  });

  // Get unique surgery types for filter dropdown
  const uniqueSurgeryTypes = [...new Set(patients.map(p => p.surgeryType).filter(Boolean))];

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

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setEditFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      dob: patient.dob || patient.dateOfBirth || '',
      address: patient.address || '',
      healthCareInsurance: patient.healthCareInsurance || '',
      email: patient.email || '',
      phone: patient.phone || '',
      patientNumber: patient.patientNumber || '',
    });
    setEditError('');
    setEditSuccess(false);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingPatient(null);
    setEditError('');
    setEditSuccess(false);
  };

  const handleEditInputChange = (field: keyof CreatePatientData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient?.id) return;

    setEditLoading(true);
    setEditError('');
    setEditSuccess(false);

    try {
      // Basic validation
      if (!editFormData.firstName.trim()) throw new Error('First Name is required');
      if (!editFormData.lastName.trim()) throw new Error('Last Name is required');
      if (!editFormData.email.trim()) throw new Error('Email is required');
      if (!editFormData.phone.trim()) throw new Error('Phone is required');
      if (!editFormData.dob.trim()) throw new Error('Date of Birth is required');
      if (!editFormData.address.trim()) throw new Error('Address is required');
      if (!editFormData.healthCareInsurance.trim()) throw new Error('Health Care Insurance is required');

      await patientService.updatePatient(editingPatient.id, {
        ...editFormData,
        // Generate a full name from firstName and lastName for backward compatibility
        name: `${editFormData.firstName} ${editFormData.lastName}`.trim(),
        // Map dob to dateOfBirth for backward compatibility
        dateOfBirth: editFormData.dob,
      });
      setEditSuccess(true);

      // Refresh the patients list
      await fetchPatients();

      // Close modal after short delay
      setTimeout(() => {
        handleCloseEditModal();
      }, 1500);
    } catch (err: any) {
      console.error('Update Patient Error:', err);
      setEditError(err.message || 'Failed to update patient');
    } finally {
      setEditLoading(false);
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
    <RoleGuard requiredRole={UserRole.SURGICAL_TEAM}>
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

        {showDeletedAlert && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: '1px solid rgba(16, 185, 129, 0.2)',
              '& .MuiAlert-icon': {
                color: '#10B981'
              }
            }}
          >
            Patient deleted successfully!
          </Alert>
        )}

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
          <>
            {/* Search and Filter Section */}
            <Box sx={{
              background: 'white',
              borderRadius: 3,
              p: 3,
              mb: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(7, 190, 184, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
                Search & Filter Patients
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by name, email, phone, or surgery type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#6B7280', mr: 1 }} />
                  }}
                  sx={{ flex: '1 1 300px', minWidth: 0 }}
                  size="small"
                />

                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 180 }} size="small">
                  <InputLabel>Surgery Type</InputLabel>
                  <Select
                    value={surgeryTypeFilter}
                    label="Surgery Type"
                    onChange={(e) => setSurgeryTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {uniqueSurgeryTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSurgeryTypeFilter('all');
                  }}
                  sx={{ color: '#6B7280', borderColor: '#6B7280' }}
                >
                  Clear Filters
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Showing {filteredPatients.length} of {patients.length} patients
              </Typography>
            </Box>

            {/* Patients Table */}
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
                        Patient Number
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
                      <TableCell sx={{
                        fontWeight: 600,
                        color: '#1F2937',
                        fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                        fontSize: '0.95rem',
                        borderBottom: '2px solid rgba(7, 190, 184, 0.2)',
                        textAlign: 'center'
                      }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPatients.map((patient, index) => (
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
                          color: '#6B7280',
                          fontWeight: 500
                        }}>
                          {patient.patientNumber || 'N/A'}
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
                          {patient.surgeryType || 'N/A'}
                        </TableCell>
                        <TableCell sx={{
                          fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                          color: '#6B7280'
                        }}>
                          {patient.surgeryDate ? formatDate(patient.surgeryDate) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={(patient.status || 'scheduled').replace('-', ' ')}
                            color={getStatusColor(patient.status || 'scheduled')}
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
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton
                              onClick={() => handleEditPatient(patient)}
                              disabled={!patient.id}
                              sx={{
                                color: '#07BEB8',
                                '&:hover': {
                                  backgroundColor: 'rgba(7, 190, 184, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                              aria-label={`Edit ${patient.name}`}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              component={Link}
                              href={`/delete-patient?id=${patient.id}`}
                              disabled={!patient.id}
                              sx={{
                                color: '#EF4444',
                                '&:hover': {
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                              aria-label={`Delete ${patient.name}`}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MuiPaper>
          </>
        )}

        {/* Edit Patient Modal */}
        <Dialog
          open={editModalOpen}
          onClose={handleCloseEditModal}
          maxWidth="md"
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
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid rgba(7, 190, 184, 0.1)'
          }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1F2937' }}>
                Edit Patient
              </Typography>
              {editingPatient && (
                <Typography variant="subtitle2" color="text.secondary">
                  Patient ID: {editingPatient.id}
                </Typography>
              )}
            </Box>
            <IconButton onClick={handleCloseEditModal} disabled={editLoading}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {editError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {editError}
              </Alert>
            )}
            {editSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Patient updated successfully! Closing modal...
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editFormData.name}
                  onChange={handleEditInputChange('name')}
                  required
                  disabled={editLoading}
                  size="small"
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange('email')}
                  required
                  disabled={editLoading}
                  size="small"
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={editFormData.phone}
                  onChange={handleEditInputChange('phone')}
                  required
                  disabled={editLoading}
                  size="small"
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={editFormData.dateOfBirth}
                  onChange={handleEditInputChange('dateOfBirth')}
                  InputLabelProps={{ shrink: true }}
                  disabled={editLoading}
                  size="small"
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Surgery Type"
                  value={editFormData.surgeryType}
                  onChange={handleEditInputChange('surgeryType')}
                  required
                  disabled={editLoading}
                  placeholder="e.g., Appendectomy, Heart Surgery"
                  size="small"
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Surgery Date"
                  type="date"
                  value={editFormData.surgeryDate}
                  onChange={handleEditInputChange('surgeryDate')}
                  required
                  disabled={editLoading}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <FormControl fullWidth disabled={editLoading} size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editFormData.status}
                    label="Status"
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as any }))}
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
                  rows={3}
                  value={editFormData.notes}
                  onChange={handleEditInputChange('notes')}
                  disabled={editLoading}
                  placeholder="Additional notes about the patient or surgery..."
                  size="small"
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(7, 190, 184, 0.1)' }}>
            <Button
              onClick={handleCloseEditModal}
              disabled={editLoading}
              variant="outlined"
              sx={{ borderColor: '#6B7280', color: '#6B7280' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePatient}
              disabled={editLoading}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)'
                }
              }}
            >
              {editLoading ? <CircularProgress size={20} color="inherit" /> : 'Update Patient'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RoleGuard>
  );
}