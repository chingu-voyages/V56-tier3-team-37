'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { patientService, Patient, CreatePatientData } from '@/lib/patient-service';
import { UserRole } from '@/lib/user-roles';
import { motion, AnimatePresence } from 'framer-motion';
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
  MenuItem,
  Tooltip
} from '@mui/material';
import BrandButton from '@/components/BrandButton';
import BrandLoader from '@/components/BrandLoader';
import InlineLoader from '@/components/InlineLoader';
import SurgeryTypeAutocomplete from '@/components/SurgeryTypeAutocomplete';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Update as UpdateIcon
} from '@mui/icons-material';

function PatientsPageContent() {
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
  const [lastNameSearch, setLastNameSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [surgeryTypeFilter, setSurgeryTypeFilter] = useState<string>('all');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [generatingNumbers, setGeneratingNumbers] = useState(false);

  const [editFormData, setEditFormData] = useState<CreatePatientData>({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    healthCareInsurance: '',
    email: '',
    phone: '',
    patientNumber: '',
    surgeryType: '',
    surgeryDate: '',
    status: 'checked-in',
    notes: '',
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
      (patient.patientId && patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.surgeryType && patient.surgeryType.toLowerCase().includes(searchTerm.toLowerCase()));

    // Last name specific search
    const patientLastName = patient.lastName || (patient.name ? patient.name.split(' ').pop() : '');
    const matchesLastNameSearch = !lastNameSearch ||
      (patientLastName && patientLastName.toLowerCase().includes(lastNameSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesSurgeryType = surgeryTypeFilter === 'all' || patient.surgeryType === surgeryTypeFilter;

    return matchesSearch && matchesLastNameSearch && matchesStatus && matchesSurgeryType;
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

  const generatePatientNumbersForExisting = async () => {
    try {
      setGeneratingNumbers(true);
      setError('');
      await patientService.generatePatientNumbersForExistingPatients();
      await fetchPatients(); // Refresh the list
      setShowDeletedAlert(true); // Show success message
      // Reset the alert after 3 seconds
      setTimeout(() => setShowDeletedAlert(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate patient numbers');
    } finally {
      setGeneratingNumbers(false);
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
      patientNumber: patient.patientId || '',
      surgeryType: patient.surgeryType || '',
      surgeryDate: patient.surgeryDate || '',
      status: patient.status || 'checked-in',
      notes: patient.notes || '',
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
    setEditErrors({});
  };

  // Client-side validation for edit modal
  const validateEditForm = () => {
    const newErrors: Record<string, string> = {};

    // First Name validation
    if (!editFormData.firstName?.trim()) {
      newErrors.firstName = 'First Name is required';
    } else if (editFormData.firstName.trim().length < 2) {
      newErrors.firstName = 'First Name must be at least 2 characters';
    }

    // Last Name validation
    if (!editFormData.lastName?.trim()) {
      newErrors.lastName = 'Last Name is required';
    } else if (editFormData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last Name must be at least 2 characters';
    }

    // Email validation
    if (!editFormData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (!editFormData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = editFormData.phone.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Date of Birth validation
    if (!editFormData.dob?.trim()) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const dobDate = new Date(editFormData.dob);
      const today = new Date();
      if (dobDate > today) {
        newErrors.dob = 'Date of Birth cannot be in the future';
      }
    }

    // Address validation
    if (!editFormData.address?.trim()) {
      newErrors.address = 'Address is required';
    } else if (editFormData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    // Health Care Insurance validation
    if (!editFormData.healthCareInsurance?.trim()) {
      newErrors.healthCareInsurance = 'Health Care Insurance is required';
    }

    // Surgery Type validation
    if (!editFormData.surgeryType?.trim()) {
      newErrors.surgeryType = 'Surgery Type is required';
    }

    return newErrors;
  };

  const handleEditInputChange = (field: keyof CreatePatientData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error for this field when user starts typing
    if (editErrors[field]) {
      setEditErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient?.id) return;

    // Validate form
    const validationErrors = validateEditForm();
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }

    setEditErrors({});
    setEditLoading(true);
    setEditError('');
    setEditSuccess(false);

    try {
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
      case 'checked-in':
        return 'checkin';
      case 'pre-procedure':
        return 'preprocedure';
      case 'in-progress':
        return 'inprogress';
      case 'closing':
        return 'closed';
      case 'recovery':
        return 'healing';
      case 'complete':
        return 'success';
      case 'dismissal':
        return 'dismissed';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading) {
    return <BrandLoader message="Loading..." />;
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <RoleGuard requiredRole={UserRole.SURGICAL_TEAM}>
      <Box sx={{
        p: 4,
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
              <BrandButton
                startIcon={<RefreshIcon />}
                onClick={fetchPatients}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)'
                  }
                }}
              >
                Refresh
              </BrandButton>
              <BrandButton
                startIcon={<AddIcon />}
                component={Link}
                href="/add-patient"
              >
                Add Patient
              </BrandButton>
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
            Operation completed successfully!
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
          <BrandLoader message="Loading patients..." />
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
              <BrandButton
                startIcon={<AddIcon />}
                component={Link}
                href="/add-patient"
              >
                Add First Patient
              </BrandButton>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Last Name Search Section for Status Updates */}
            <Box sx={{
              background: 'white',
              borderRadius: 3,
              p: 3,
              mb: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(7, 190, 184, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
                Search in Patient Status Update
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Quickly locate patients to update their surgery status
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  label="Last Name"
                  placeholder="Enter last name to search..."
                  value={lastNameSearch}
                  onChange={(e) => setLastNameSearch(e.target.value)}
                  sx={{ flex: '1 1 300px', minWidth: 0 }}
                  size="small"
                />

                <BrandButton
                  startIcon={<SearchIcon />}
                  onClick={() => {
                    // Search is already active via onChange, this button provides visual feedback
                  }}
                >
                  Search
                </BrandButton>

                <BrandButton
                  onClick={() => {
                    setLastNameSearch('');
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)'
                    }
                  }}
                >
                  Clear
                </BrandButton>
              </Box>

              {lastNameSearch && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Searching for last name: "{lastNameSearch}" - Found {filteredPatients.length} patients
                </Typography>
              )}
            </Box>

            {/* Advanced Search and Filter Section */}
            <Box sx={{
              background: 'white',
              borderRadius: 3,
              p: 3,
              mb: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(7, 190, 184, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
                Advanced Search & Filters
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
                    <MenuItem value="checked-in">Checked In</MenuItem>
                    <MenuItem value="pre-procedure">Pre-Procedure</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="closing">Closing</MenuItem>
                    <MenuItem value="recovery">Recovery</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="dismissal">Dismissal</MenuItem>
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
                    setLastNameSearch('');
                    setStatusFilter('all');
                    setSurgeryTypeFilter('all');
                  }}
                  sx={{ color: '#6B7280', borderColor: '#6B7280' }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={generatePatientNumbersForExisting}
                  disabled={generatingNumbers}
                  startIcon={generatingNumbers ? <InlineLoader size={16} /> : <UpdateIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #07BEB8 0%, #059669 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                    },
                    '&:disabled': {
                      background: '#9CA3AF'
                    }
                  }}
                >
                  {generatingNumbers ? 'Generating...' : 'Generate Patient Numbers'}
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
                    <AnimatePresence>
                      {filteredPatients.map((patient, index) => (
                        <motion.tr
                          key={patient.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          whileHover={{
                            backgroundColor: 'rgba(7, 190, 184, 0.05)',
                            scale: 1.001,
                            transition: { duration: 0.2 }
                          }}
                          style={{
                            backgroundColor: index % 2 === 0 ? 'white' : 'rgba(7, 190, 184, 0.02)'
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
                            {patient.patientId || 'N/A'}
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
                              label={(patient.status || 'checked-in').replace('-', ' ')}
                              color={getStatusColor(patient.status || 'checked-in')}
                              size="small"
                              sx={{
                                textTransform: 'capitalize',
                                fontWeight: 600,
                                borderRadius: 1.5,
                                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                                '&.MuiChip-colorCheckin': {
                                  backgroundColor: '#737373',
                                  color: 'white'
                                },
                                '&.MuiChip-colorPreprocedure': {
                                  backgroundColor: '#4F81BD',
                                  color: 'white'
                                },
                                '&.MuiChip-colorInprogress': {
                                  backgroundColor: '#2B5CAA',
                                  color: 'white'
                                },
                                '&.MuiChip-colorClosed': {
                                  backgroundColor: '#E5B567',
                                  color: 'white'
                                },
                                '&.MuiChip-colorHealing': {
                                  backgroundColor: '#5AAE61',
                                  color: 'white'
                                },
                                '&.MuiChip-colorSuccess': {
                                  backgroundColor: '#1B7837',
                                  color: 'white'
                                },
                                '&.MuiChip-colorDismissed': {
                                  backgroundColor: '#1F9E89',
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
                              <Tooltip title="Update Patient Status" arrow>
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
                                  aria-label={`Update status for ${patient.name}`}
                                >
                                  <UpdateIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Patient Details" arrow>
                                <IconButton
                                  component={Link}
                                  href={`/edit-patient/${patient.id}`}
                                  disabled={!patient.id}
                                  sx={{
                                    color: '#059669',
                                    '&:hover': {
                                      backgroundColor: 'rgba(5, 150, 105, 0.1)',
                                      transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.3s ease'
                                  }}
                                  aria-label={`Edit details for ${patient.name}`}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
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
                        </motion.tr>
                      ))}
                    </AnimatePresence>
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
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(7, 190, 184, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 3,
            px: 3,
            pt: 3,
            borderBottom: '1px solid rgba(7, 190, 184, 0.1)'
          }}>
            <Box>
              <Typography variant="h5" sx={{
                fontWeight: 700,
                color: '#1F2937',
                mb: 1,
                fontFamily: 'var(--font-roboto), Roboto, sans-serif'
              }}>
                Update Patient Status
              </Typography>
              {editingPatient && (
                <Typography variant="body2" sx={{
                  color: '#6B7280',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                }}>
                  Patient: {editingPatient.name} (ID: {editingPatient.patientId || editingPatient.id})
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleCloseEditModal}
              disabled={editLoading}
              sx={{
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: 'rgba(107, 114, 128, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3, px: 3 }}>
            {editError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {editError}
              </Alert>
            )}
            {editSuccess && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Patient updated successfully! Closing modal...
              </Alert>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              <TextField
                fullWidth
                label="First Name *"
                value={editFormData.firstName}
                onChange={handleEditInputChange('firstName')}
                error={!!editErrors.firstName}
                helperText={editErrors.firstName}
                required
                disabled={editLoading}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: editErrors.firstName ? '#EF4444' : '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: editErrors.firstName ? '#EF4444' : '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: editErrors.firstName ? '#EF4444' : '#07BEB8'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Last Name *"
                value={editFormData.lastName}
                onChange={handleEditInputChange('lastName')}
                error={!!editErrors.lastName}
                helperText={editErrors.lastName}
                required
                disabled={editLoading}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: editErrors.lastName ? '#EF4444' : '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: editErrors.lastName ? '#EF4444' : '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: editErrors.lastName ? '#EF4444' : '#07BEB8'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={editFormData.email}
                onChange={handleEditInputChange('email')}
                error={!!editErrors.email}
                helperText={editErrors.email}
                required
                disabled={editLoading}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: editErrors.email ? '#EF4444' : '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: editErrors.email ? '#EF4444' : '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: editErrors.email ? '#EF4444' : '#07BEB8'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Phone Number *"
                value={editFormData.phone}
                onChange={handleEditInputChange('phone')}
                error={!!editErrors.phone}
                helperText={editErrors.phone}
                required
                disabled={editLoading}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: editErrors.phone ? '#EF4444' : '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: editErrors.phone ? '#EF4444' : '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: editErrors.phone ? '#EF4444' : '#07BEB8'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={editFormData.dob}
                onChange={handleEditInputChange('dob')}
                error={!!editErrors.dob}
                helperText={editErrors.dob}
                InputLabelProps={{ shrink: true }}
                disabled={editLoading}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: editErrors.dob ? '#EF4444' : '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: editErrors.dob ? '#EF4444' : '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: editErrors.dob ? '#EF4444' : '#07BEB8'
                    }
                  }
                }}
              />

              <SurgeryTypeAutocomplete
                value={editFormData.surgeryType || ''}
                onChange={(value) => {
                  setEditFormData(prev => ({ ...prev, surgeryType: value }));
                  if (editErrors.surgeryType) {
                    setEditErrors(prev => ({ ...prev, surgeryType: '' }));
                  }
                }}
                error={!!editErrors.surgeryType}
                helperText={editErrors.surgeryType}
                required
                disabled={editLoading}
                placeholder="Search for surgery type..."
              />

              <TextField
                fullWidth
                label="Surgery Date"
                type="date"
                value={editFormData.surgeryDate}
                onChange={handleEditInputChange('surgeryDate')}
                InputLabelProps={{ shrink: true }}
                disabled={editLoading}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#07BEB8'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Address *"
                value={editFormData.address}
                onChange={handleEditInputChange('address')}
                error={!!editErrors.address}
                helperText={editErrors.address}
                required
                disabled={editLoading}
                size="small"
                sx={{
                  gridColumn: '1 / -1',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: editErrors.address ? '#EF4444' : '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: editErrors.address ? '#EF4444' : '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: editErrors.address ? '#EF4444' : '#07BEB8'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Health Care Insurance *"
                value={editFormData.healthCareInsurance}
                onChange={handleEditInputChange('healthCareInsurance')}
                error={!!editErrors.healthCareInsurance}
                helperText={editErrors.healthCareInsurance}
                required
                disabled={editLoading}
                size="small"
                sx={{
                  gridColumn: '1 / -1',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: editErrors.healthCareInsurance ? '#EF4444' : '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: editErrors.healthCareInsurance ? '#EF4444' : '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: editErrors.healthCareInsurance ? '#EF4444' : '#07BEB8'
                    }
                  }
                }}
              />

              <FormControl fullWidth disabled={editLoading} size="small">
                <InputLabel sx={{
                  fontWeight: 600,
                  color: '#1F2937',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                }}>
                  Status *
                </InputLabel>
                <Select
                  value={editFormData.status}
                  label="Status *"
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                      borderWidth: 1
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#07BEB8'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#07BEB8'
                    }
                  }}
                >
                  <MenuItem value="checked-in">Checked In</MenuItem>
                  <MenuItem value="pre-procedure">Pre-Procedure</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="closing">Closing</MenuItem>
                  <MenuItem value="recovery">Recovery</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="dismissal">Dismissal</MenuItem>
                </Select>
              </FormControl>

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
                sx={{
                  gridColumn: '1 / -1',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#07BEB8'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#07BEB8'
                    }
                  }
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(7, 190, 184, 0.1)', gap: 2, display: 'flex', justifyContent: 'center' }}>
            <BrandButton
              onClick={handleCloseEditModal}
              disabled={editLoading}
            >
              Cancel
            </BrandButton>
            <BrandButton
              onClick={handleUpdatePatient}
              disabled={editLoading}
              startIcon={editLoading ? <InlineLoader size={20} /> : undefined}
            >
              {editLoading ? 'Updating...' : 'Update'}
            </BrandButton>
          </DialogActions>
        </Dialog>
      </Box>
    </RoleGuard>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<BrandLoader message="Loading..." />}>
      <PatientsPageContent />
    </Suspense>
  );
}