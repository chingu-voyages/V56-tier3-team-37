'use client';

import { useAuth } from '@/lib/auth-context';
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
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useState } from 'react';

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

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__navbar">
          <div className="header__brand">
            <Link href="/" className="header__brand-link">
              <span className="header__brand-name">Care Flow</span>
              <span className="header__brand-date">{currentDate}</span>
            </Link>
          </div>

          <nav className="header__nav">
            <Link href="/" className="header__nav-item">Home</Link>
            {user && (
              <>
                {userRole === 'admin' && (
                  <Link href="/add-patient" className="header__nav-item">Patient Information</Link>
                )}
                {(userRole === 'admin' || userRole === 'surgical-team') && (
                  <Link href="/patients" className="header__nav-item">Patient Status Update</Link>
                )}
                <Link href="/patients" className="header__nav-item">Patient Status</Link>
              </>
            )}
          </nav>

          <div className="header__user-menu">
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease'
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
                        right: 14,
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
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
                      label={userRole === 'admin' ? 'Administrator' : userRole === 'surgical-team' ? 'Surgical Team' : 'Guest'}
                      size="small"
                      sx={{
                        bgcolor: userRole === 'admin'
                          ? 'rgba(7, 190, 184, 0.1)'
                          : userRole === 'surgical-team'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(107, 114, 128, 0.1)',
                        color: userRole === 'admin'
                          ? '#07BEB8'
                          : userRole === 'surgical-team'
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
              <Link href="/auth" className="form__button form__button--outline">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 