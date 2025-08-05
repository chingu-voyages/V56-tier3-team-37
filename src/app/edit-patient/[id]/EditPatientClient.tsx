'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
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
import BrandButton from '@/components/BrandButton';
import BrandLoader from '@/components/BrandLoader';
import InlineLoader from '@/components/InlineLoader';

interface EditPatientClientProps {
    params: Promise<{ id: string }>;
}

export default function EditPatientClient({ params }: EditPatientClientProps) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [patientId, setPatientId] = useState<string>('');

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
        const getParams = async () => {
            const resolvedParams = await params;
            setPatientId(resolvedParams.id);
        };
        getParams();
    }, [params]);

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
            {(loading || fetchingPatient) && (
                <BrandLoader
                    fullScreen
                    message={loading ? "Updating patient..." : "Loading patient..."}
                />
            )}
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

                                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                                    <TextField
                                        fullWidth
                                        label="Date of Birth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange('dateOfBirth')}
                                        InputLabelProps={{ shrink: true }}
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

                                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                                    <FormControl fullWidth disabled={loading}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={formData.status}
                                            label="Status"
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
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
                                            disabled={loading}
                                            startIcon={loading ? <InlineLoader size={20} /> : <SaveIcon />}
                                        >
                                            {loading ? 'Updating...' : 'Update Patient'}
                                        </BrandButton>
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