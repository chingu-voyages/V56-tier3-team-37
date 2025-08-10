'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    Box,
    Typography,
    IconButton,
    Avatar,
    Divider,
    Chip
} from '@mui/material';
import {
    Person as PersonIcon,
    Logout as LogoutIcon,
    AccountCircle as AccountCircleIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/user-roles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}

const menuItems = [
    { href: '/', label: 'Care Flow', isActive: true },
    { href: '/status', label: 'Patient Status' },
    { href: '/patients', label: 'Update Patient Status', adminOnly: true, surgicalTeamOnly: true },
    { href: '/add-patient', label: 'Patient Information', adminOnly: true }
];

export default function MobileMenu({ isOpen, onClose, triggerRef }: MobileMenuProps) {
    const { user, userRole, userInfo, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        onClose();
        await logout();
        router.push('/');
    };

    const handleItemClick = (href: string) => {
        onClose();
        router.push(href);
    };

    // Calculate trigger position for radial animation
    const getTriggerPosition = () => {
        if (!triggerRef.current) return { x: 0, y: 0 };
        const rect = triggerRef.current.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    };

    const triggerPos = getTriggerPosition();

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1299
                        }}
                        onClick={onClose}
                    />

                    {/* Radial Background */}
                    <motion.div
                        initial={{
                            scale: 0,
                            x: triggerPos.x - 200,
                            y: triggerPos.y - 200,
                            borderRadius: '50%'
                        }}
                        animate={{
                            scale: 1,
                            x: 0,
                            y: 0,
                            borderRadius: '0%'
                        }}
                        exit={{
                            scale: 0,
                            x: triggerPos.x - 200,
                            y: triggerPos.y - 200,
                            borderRadius: '50%'
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 100,
                            damping: 20,
                            duration: 0.6
                        }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, #07BEB8 0%, #0EA5AA 50%, #0D9488 100%)',
                            zIndex: 1300,
                            transformOrigin: `${triggerPos.x}px ${triggerPos.y}px`
                        }}
                    />

                    {/* Menu Content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1301,
                            padding: '2rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header with Close Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                                }}
                            >
                                Menu
                            </Typography>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                        }
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </motion.div>
                        </Box>

                        {/* User Info Section */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                style={{ marginBottom: '2rem' }}
                            >
                                <Box sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 2,
                                    p: 2,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                mr: 2,
                                                border: '2px solid rgba(255, 255, 255, 0.3)'
                                            }}
                                        >
                                            <AccountCircleIcon sx={{ fontSize: 32, color: 'white' }} />
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Welcome back
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'white',
                                                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {userInfo?.name || user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={userRole === UserRole.ADMIN ? 'Administrator' : userRole === UserRole.SURGICAL_TEAM ? 'Surgical Team' : 'Guest'}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                                            border: '1px solid rgba(255, 255, 255, 0.3)'
                                        }}
                                    />
                                </Box>
                            </motion.div>
                        )}

                        {/* Navigation Items */}
                        <Box sx={{ flex: 1 }}>
                            {menuItems.map((item, index) => {
                                // Check if item should be shown based on user role
                                if (item.adminOnly && userRole !== UserRole.ADMIN) return null;
                                if (item.surgicalTeamOnly && !(userRole === UserRole.ADMIN || userRole === UserRole.SURGICAL_TEAM)) return null;
                                if (!user && (item.adminOnly || item.surgicalTeamOnly)) return null;

                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.4 + index * 0.1,
                                            duration: 0.4,
                                            type: 'spring',
                                            stiffness: 100
                                        }}
                                    >
                                        <Box
                                            onClick={() => handleItemClick(item.href)}
                                            sx={{
                                                backgroundColor: item.isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: 2,
                                                p: 2,
                                                mb: 1.5,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                border: item.isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                                    transform: 'translateX(8px)'
                                                }
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: item.isActive ? 700 : 600,
                                                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                );
                            })}
                        </Box>

                        {/* Logout Button */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.4 }}
                            >
                                <Box
                                    onClick={handleLogout}
                                    sx={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                        borderRadius: 2,
                                        p: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LogoutIcon sx={{ color: '#FCA5A5', mr: 2, fontSize: 24 }} />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#FCA5A5',
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                                            }}
                                        >
                                            Sign Out
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
