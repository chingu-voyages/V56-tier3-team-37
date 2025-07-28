'use client';

import { useState, useEffect } from 'react';
import { patientService, Patient } from '@/lib/patient-service';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    Container,
    Grid
} from '@mui/material';
import {
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

export default function StatusPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await patientService.getPatients();
            setPatients(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch patient status');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: Patient['status']) => {
        switch (status) {
            case 'scheduled':
                return <ScheduleIcon sx={{ color: '#07BEB8' }} />;
            case 'in-progress':
                return <WarningIcon sx={{ color: '#F59E0B' }} />;
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#10B981' }} />;
            case 'cancelled':
                return <CancelIcon sx={{ color: '#EF4444' }} />;
            default:
                return <PersonIcon />;
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

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                p: 4
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
                    Loading patient status...
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                minHeight: '100vh',
                p: 4,
                borderRadius: 3
            }}>
                {/* Header */}
                <Box sx={{
                    background: 'white',
                    borderRadius: 3,
                    p: 4,
                    mb: 4,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(7, 190, 184, 0.1)'
                }}>
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
                        Patient Status Display
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                            fontSize: '1.1rem'
                        }}
                    >
                        Real-time updates on surgery progress and patient status
                    </Typography>
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

                {patients.length === 0 ? (
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
                            <PersonIcon sx={{
                                fontSize: 64,
                                color: '#6B7280',
                                mb: 2
                            }} />
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
                                    fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                                }}
                            >
                                Patient status information will appear here once patients are added to the system.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {patients.map((patient) => (
                            <Box sx={{ flex: '1 1 350px', minWidth: 0 }} key={patient.id}>
                                <Card sx={{
                                    height: '100%',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(7, 190, 184, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            {getStatusIcon(patient.status)}
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                                sx={{
                                                    ml: 1,
                                                    fontWeight: 600,
                                                    color: '#1F2937',
                                                    fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                                                }}
                                            >
                                                {patient.name}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                                            }}
                                        >
                                            {patient.surgeryType}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            Surgery Date: {formatDate(patient.surgeryDate)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
} 