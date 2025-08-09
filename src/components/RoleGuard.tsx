'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/user-roles';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper
} from '@mui/material';
import {
    Security as SecurityIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import Link from 'next/link';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
    fallback?: React.ReactNode;
}

export default function RoleGuard({
    children,
    requiredRole = UserRole.GUEST,
    fallback
}: RoleGuardProps) {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();

    // Check if user has the required role
    const hasAccess = () => {
        if (requiredRole === UserRole.GUEST) return true;
        if (!user) return false;

        const roleHierarchy: Record<UserRole, number> = {
            [UserRole.GUEST]: 0,
            [UserRole.SURGICAL_TEAM]: 1,
            [UserRole.ADMIN]: 2
        };

        return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    };

    useEffect(() => {
        if (!loading && !hasAccess()) {
            // Redirect to appropriate page based on role
            if (!user) {
                router.push('/auth');
            } else {
                router.push('/patients'); // Default fallback for authenticated users
            }
        }
    }, [user, userRole, loading, router]);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!hasAccess()) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,

                    }}
                >
                    <SecurityIcon
                        sx={{
                            fontSize: 64,
                            color: '#EF4444',
                            mb: 2
                        }}
                    />
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: '#1F2937',
                            fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                        }}
                    >
                        Access Denied
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                            fontSize: '1.1rem'
                        }}
                    >
                        You don't have permission to access this page.
                        {!user && ' Please sign in to continue.'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            component={Link}
                            href="/"
                            startIcon={<HomeIcon />}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Go Home
                        </Button>

                        {!user && (
                            <Button
                                variant="outlined"
                                component={Link}
                                href="/auth"
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    borderColor: '#07BEB8',
                                    color: '#07BEB8',
                                    '&:hover': {
                                        borderColor: '#059B96',
                                        backgroundColor: 'rgba(7, 190, 184, 0.05)'
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Container>
        );
    }

    return <>{children}</>;
} 