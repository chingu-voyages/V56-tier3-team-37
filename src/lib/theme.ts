import { createTheme, ThemeOptions } from '@mui/material/styles';

// Teal color palette from the image
const tealPalette = {
  teal: '#07BEB8',
  mediumTeal: '#3DCCC7',
  lightAqua: '#68d8D6',
  lightBlue: '#9CEAEF',
  veryLightAqua: '#C4FFF9',
  black: '#000000',
};

// Custom theme configuration
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: tealPalette.teal,
      light: tealPalette.mediumTeal,
      dark: '#059B96', // Darker shade of teal
      contrastText: '#ffffff',
    },
    secondary: {
      main: tealPalette.lightBlue,
      light: tealPalette.veryLightAqua,
      dark: '#7BD8DD', // Darker shade of light blue
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#171717',
      secondary: '#64748b',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: tealPalette.lightAqua,
      light: tealPalette.lightBlue,
      dark: tealPalette.mediumTeal,
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto), Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(7, 190, 184, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(7, 190, 184, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tealPalette.mediumTeal,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: tealPalette.teal,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: tealPalette.teal,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: tealPalette.veryLightAqua,
          },
          '&.Mui-selected': {
            backgroundColor: tealPalette.lightAqua,
            '&:hover': {
              backgroundColor: tealPalette.mediumTeal,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: tealPalette.lightAqua,
          color: tealPalette.teal,
        },
        colorSecondary: {
          backgroundColor: tealPalette.lightBlue,
          color: '#000000',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        standardInfo: {
          backgroundColor: tealPalette.veryLightAqua,
          color: tealPalette.teal,
          '& .MuiAlert-icon': {
            color: tealPalette.teal,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: tealPalette.veryLightAqua,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: tealPalette.teal,
        },
      },
    },
  },
};

// Create and export the theme
export const theme = createTheme(themeOptions);

// Export the color palette for use in other parts of the app
export { tealPalette };

// Type for theme customization
export type AppTheme = typeof theme; 