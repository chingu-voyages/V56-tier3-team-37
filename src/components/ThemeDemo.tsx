'use client';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    Chip,
    Alert,
    LinearProgress,
    CircularProgress,
    Paper,
    Divider,
} from '@mui/material';
import { tealPalette } from '@/lib/theme';

export default function ThemeDemo() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: tealPalette.teal }}>
                Material UI Theme Demo
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                This component showcases the custom teal theme applied to Material UI components.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Buttons */}
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Buttons
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                            <Button variant="contained">Primary</Button>
                            <Button variant="outlined">Secondary</Button>
                            <Button variant="text">Text</Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button variant="contained" color="secondary">
                                Secondary
                            </Button>
                            <Button variant="contained" color="success">
                                Success
                            </Button>
                            <Button variant="contained" color="warning">
                                Warning
                            </Button>
                            <Button variant="contained" color="error">
                                Error
                            </Button>
                        </Box>
                    </Paper>
                </Box>

                {/* Cards */}
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Cards
                        </Typography>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Primary Card
                                </Typography>
                                <Typography variant="body2">
                                    This card uses the primary teal theme colors.
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ backgroundColor: tealPalette.veryLightAqua }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Custom Background
                                </Typography>
                                <Typography variant="body2">
                                    This card uses a custom background color from the palette.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                </Box>

                {/* Form Elements */}
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Form Elements
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Primary Input"
                                variant="outlined"
                                placeholder="Type something..."
                            />
                            <TextField
                                label="Secondary Input"
                                variant="outlined"
                                color="secondary"
                                placeholder="Secondary field..."
                            />
                            <TextField
                                label="Error Input"
                                variant="outlined"
                                color="error"
                                error
                                helperText="This field has an error"
                            />
                        </Box>
                    </Paper>
                </Box>

                {/* Chips and Alerts */}
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Chips & Alerts
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip label="Primary" color="primary" />
                            <Chip label="Secondary" color="secondary" />
                            <Chip label="Success" color="success" />
                            <Chip label="Warning" color="warning" />
                            <Chip label="Error" color="error" />
                        </Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            This is an info alert using the teal theme.
                        </Alert>
                        <Alert severity="success">
                            This is a success alert with the theme colors.
                        </Alert>
                    </Paper>
                </Box>

                {/* Progress Indicators */}
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Progress Indicators
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" gutterBottom>
                                Linear Progress
                            </Typography>
                            <LinearProgress sx={{ mb: 2 }} />
                            <LinearProgress variant="determinate" value={75} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="body2">Circular Progress:</Typography>
                            <CircularProgress size={24} />
                            <CircularProgress size={32} />
                            <CircularProgress size={40} />
                        </Box>
                    </Paper>
                </Box>

                {/* Color Palette */}
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Color Palette
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: tealPalette.teal,
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2">Teal: {tealPalette.teal}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: tealPalette.mediumTeal,
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2">Medium Teal: {tealPalette.mediumTeal}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: tealPalette.lightAqua,
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2">Light Aqua: {tealPalette.lightAqua}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: tealPalette.lightBlue,
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2">Light Blue: {tealPalette.lightBlue}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: tealPalette.veryLightAqua,
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2">Very Light Aqua: {tealPalette.veryLightAqua}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
} 