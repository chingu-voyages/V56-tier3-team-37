'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { patientService, Patient } from '@/lib/patient-service';
import { UserRole } from '@/lib/user-roles';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Alert,
    Container
} from '@mui/material';
import BrandLoader from '@/components/BrandLoader';
import {
    Person as PersonIcon,
    EventAvailable as EventAvailableIcon, //checked-in
    MedicalServices as MedicalServicesIcon, //pre-procedure
    MonitorHeart as MonitorHeartIcon, //in-progress
    AssignmentTurnedIn as AssignmentTurnedInIcon, //closing
    Healing as HealingIcon, //recovery
    CheckCircle as CheckCircleIcon, //completed
    ExitToApp as ExitToAppIcon //dismissal
} from '@mui/icons-material';

declare module '@mui/material/Chip' {
    interface ChipPropsColorOverrides {
        checkin: true;
        preprocedure: true;
        inprogress: true;
        closed: true;
        healing: true;
        success: true;
        dismissed: true;
        }
    }

export default function StatusPage() {
    const { user, userRole, loading: authLoading } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Always fetch patients regardless of authentication status
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
            case 'checked-in':
                return <EventAvailableIcon sx={{ color: '#737373' }} />;
            case 'pre-procedure':
                return <MedicalServicesIcon sx={{ color: '#4F81BD' }} />;
            case 'in-progress':
                return <MonitorHeartIcon sx={{ color: '#2B5CAA' }} />;
            case 'closing':
                return <AssignmentTurnedInIcon sx={{ color: '#E5B567' }} />;
            case 'recovery':
                return <HealingIcon sx={{ color: '#5AAE61' }} />;
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#1B7837' }} />;
            case 'dismissal':
                return <ExitToAppIcon sx={{ color: '#1F9E89' }} />;
            default:
                return <PersonIcon />;
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
            case 'completed':
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

    // Check user role using the enum
    const isAuthenticated = userRole === UserRole.ADMIN || userRole === UserRole.SURGICAL_TEAM;
    const isGuest = userRole === UserRole.GUEST;

    // Debug logging
    console.log('Auth Debug:', { user: user?.email, userRole, isAuthenticated, isGuest });

    if (loading || authLoading) {
        return <BrandLoader message="Loading patient status..." />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{
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
                    {isGuest && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                                fontSize: '0.9rem',
                                mt: 1,
                                fontStyle: 'italic'
                            }}
                        >
                            Public view - showing limited information for privacy
                        </Typography>
                    )}
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
                        {patients.map((patient, index) => (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                style={{ flex: '1 1 350px', minWidth: 0 }}
                            >
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
                                            {getStatusIcon(patient.status || 'checked-in')}
                                            {getStatusIcon(patient.status || 'checked-in')}
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
                                                {isGuest ? `Patient ${patient.patientId || 'Loading...'}` : patient.name}
                                            </Typography>
                                        </Box>

                                        {/* Only show status for guests - no other information */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Chip
                                                label={(patient.status || 'checked-in').replace('-', ' ')}
                                                color={getStatusColor(patient.status || 'checked-in')}
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
                                                    '&.MuiChip-colorInfo': {
                                                        backgroundColor: '#06B6D4',
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
                                        </Box>

                                        {/* Only show additional info for authenticated users */}
                                        {isAuthenticated && (
                                            <>
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

                                                {patient.surgeryDate && (
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
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
} 