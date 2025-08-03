'use client';

import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/user-roles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  PushPin as PushPinIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const { user, userRole, userInfo, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    router.push('/');
  };

  // Get current date in dd.mm.yyyy format
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <header>
      {/* Main Navigation Bar - Teal Background */}
      <Box
        sx={{
          backgroundColor: '#07BEB8',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-roboto), Roboto, sans-serif'
        }}
      >
        {/* Left side - User Avatar and Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* User Avatar - Moved to the left */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        bgcolor: 'rgba(255, 255, 255, 0.25)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Avatar>
                </IconButton>
              </motion.div>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 280,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    border: '1px solid rgba(7, 190, 184, 0.1)',
                    overflow: 'visible',
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      left: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'white',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                      borderLeft: '1px solid rgba(7, 190, 184, 0.1)',
                      borderTop: '1px solid rgba(7, 190, 184, 0.1)'
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2, pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: '#07BEB8',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(7, 190, 184, 0.3)'
                      }}
                    >
                      <AccountCircleIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Welcome back
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                          fontWeight: 600,
                          color: '#1F2937',
                          fontSize: '1rem'
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
                      bgcolor: userRole === UserRole.ADMIN
                        ? 'rgba(7, 190, 184, 0.1)'
                        : userRole === UserRole.SURGICAL_TEAM
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(107, 114, 128, 0.1)',
                      color: userRole === UserRole.ADMIN
                        ? '#07BEB8'
                        : userRole === UserRole.SURGICAL_TEAM
                          ? '#F59E0B'
                          : '#6B7280',
                      fontWeight: 600,
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }}
                  />
                </Box>

                <Divider sx={{ mx: 2, my: 1 }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    mx: 1,
                    mb: 1,
                    borderRadius: 1.5,
                    py: 1.5,
                    px: 2,
                    color: '#EF4444',
                    '&:hover': {
                      bgcolor: 'rgba(239, 68, 68, 0.08)',
                      color: '#DC2626'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      fontWeight: 500
                    }}
                  >
                    Sign Out
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Typography
              component={Link}
              href="/auth"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                opacity: 0.9,
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              Login
            </Typography>
          )}

          {/* Care Flow - Active Item */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'white',
                opacity: 0.8
              }}
            />
            <Typography
              component={Link}
              href="/"
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                color: 'white',
                textDecoration: 'none',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              Care Flow
            </Typography>
          </Box>

          {/* Patient Status */}
          <Typography
            component={Link}
            href="/status"
            variant="body1"
            sx={{
              fontWeight: 500,
              fontSize: '1rem',
              color: 'white',
              opacity: 0.9,
              textDecoration: 'none',
              '&:hover': {
                opacity: 1
              }
            }}
          >
            Patient Status
          </Typography>

          {/* Update Patient Status - Only show for authenticated users */}
          {user && (userRole === UserRole.ADMIN || userRole === UserRole.SURGICAL_TEAM) && (
            <Typography
              component={Link}
              href="/patients"
              variant="body1"
              sx={{
                fontWeight: 500,
                fontSize: '1rem',
                color: 'white',
                opacity: 0.9,
                lineHeight: 1.2,
                textDecoration: 'none',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              Update Patient<br />Status
            </Typography>
          )}

          {/* Patient Information - Only show for Admin */}
          {user && userRole === UserRole.ADMIN && (
            <Typography
              component={Link}
              href="/add-patient"
              variant="body1"
              sx={{
                fontWeight: 500,
                fontSize: '1rem',
                color: 'white',
                opacity: 0.9,
                lineHeight: 1.2,
                textDecoration: 'none',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              Patient<br />Information
            </Typography>
          )}
        </Box>

        {/* Right side - Date only */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            fontSize: '1rem',
            color: 'white',
            opacity: 0.9
          }}
        >
          {currentDate}
        </Typography>
      </Box>
    </header>
  );
} 