'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Divider,
    Alert,
    Container
} from '@mui/material';
import SurgeryTypeAutocomplete from '@/components/SurgeryTypeAutocomplete';
import { STANDARDIZED_SURGERY_TYPES, SURGERY_CATEGORIES } from '@/lib/surgery-types';

export default function SurgeryTypesDemoPage() {
    const [selectedSurgeryType, setSelectedSurgeryType] = useState('');

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
                Standardized Surgery Types
            </Typography>

            <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
                Comprehensive list of {STANDARDIZED_SURGERY_TYPES.length}+ standardized surgical procedures with autocomplete functionality
            </Typography>

            <Alert severity="success" sx={{ mb: 4 }}>
                <Typography variant="body1">
                    <strong>Enhanced UX Design:</strong> 🎨 Category-level icons & 🆕 {SURGERY_CATEGORIES.length} medical specialties covered
                </Typography>
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                    <strong>Smart Icon System:</strong> Icons appear only in category headers to avoid visual clutter<br />
                    <strong>Visual Hierarchy:</strong> Clear category identification with subtle procedure indicators<br />
                    <strong>Professional Design:</strong> Medical-grade interface following UX best practices
                </Typography>
            </Alert>

            <Alert severity="info" sx={{ mb: 4 }}>
                <Typography variant="body1">
                    <strong>Benefits of Standardization:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                    ✅ Eliminates spelling errors and typos<br />
                    ✅ Ensures consistent terminology across the organization<br />
                    ✅ Improves data quality for reporting and analytics<br />
                    ✅ Reduces training time for new staff<br />
                    ✅ Enhances patient safety through clear communication
                </Typography>
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                {/* Autocomplete Demo */}
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom color="primary">
                            Try the Autocomplete
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Start typing to search for surgery types. The autocomplete includes categories, descriptions, and common aliases.
                        </Typography>

                        <SurgeryTypeAutocomplete
                            value={selectedSurgeryType}
                            onChange={setSelectedSurgeryType}
                            placeholder="Search for surgery type..."
                            label="Surgery Type"
                        />

                        {selectedSurgeryType && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                    Selected Surgery Type:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedSurgeryType}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom color="primary">
                            Coverage Statistics
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Box textAlign="center">
                                <Typography variant="h4" color="primary">
                                    {STANDARDIZED_SURGERY_TYPES.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Surgery Types
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h4" color="primary">
                                    {SURGERY_CATEGORIES.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Categories
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Categories and Surgery Types */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h4" component="h2" gutterBottom color="primary">
                    Available Categories
                </Typography>

                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    Each category has a distinctive icon, while individual procedures use subtle visual indicators for a clean, professional appearance.
                </Typography>

                {/* UX Improvement Showcase */}
                <Card elevation={2} sx={{ mb: 4, border: '2px solid #07BEB8' }}>
                    <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom color="primary">
                            🎨 UX Design Improvement
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" color="error" gutterBottom>
                                    ❌ Before: Repetitive Icons
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    backgroundColor: '#FEF2F2',
                                    borderRadius: 1,
                                    border: '1px solid #FECACA'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🫀</span>
                                        <Typography variant="body2">Cardiac & Cardiovascular</Typography>
                                    </Box>
                                    <Box sx={{ pl: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <span style={{ fontSize: '1rem', marginRight: '8px' }}>🫀</span>
                                            <Typography variant="body2">CABG</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <span style={{ fontSize: '1rem', marginRight: '8px' }}>🫀</span>
                                            <Typography variant="body2">Heart Valve Replacement</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1rem', marginRight: '8px' }}>🫀</span>
                                            <Typography variant="body2">Angioplasty</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    Problem: Same icon repeated for every procedure creates visual noise
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="success.main" gutterBottom>
                                    ✅ After: Clean Category Icons
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    backgroundColor: '#F0FDF4',
                                    borderRadius: 1,
                                    border: '1px solid #BBF7D0'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 1,
                                        backgroundColor: 'rgba(7, 190, 184, 0.1)',
                                        p: 1,
                                        borderRadius: 1
                                    }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🫀</span>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Cardiac & Cardiovascular</Typography>
                                    </Box>
                                    <Box sx={{ pl: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <Box sx={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: '#07BEB8',
                                                marginRight: '8px'
                                            }} />
                                            <Typography variant="body2">CABG</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <Box sx={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: '#07BEB8',
                                                marginRight: '8px'
                                            }} />
                                            <Typography variant="body2">Heart Valve Replacement</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: '#07BEB8',
                                                marginRight: '8px'
                                            }} />
                                            <Typography variant="body2">Angioplasty</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    Solution: Icon only in category header, subtle dots for procedures
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {SURGERY_CATEGORIES.map((category) => {
                    const categorySurgeries = STANDARDIZED_SURGERY_TYPES.filter(
                        surgery => surgery.category === category
                    );

                    return (
                        <Card key={category} elevation={2} sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" component="h3" gutterBottom color="primary">
                                    {category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {categorySurgeries.length} procedure{categorySurgeries.length !== 1 ? 's' : ''} available
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {categorySurgeries.map((surgery) => (
                                        <Chip
                                            key={surgery.id}
                                            label={surgery.name}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderColor: '#07BEB8',
                                                color: '#07BEB8',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(7, 190, 184, 0.1)',
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* Implementation Notes */}
            <Box sx={{ mt: 6 }}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom color="primary">
                            Implementation Details
                        </Typography>

                        <Typography variant="body1" paragraph>
                            This standardized surgery types system has been implemented across the application to ensure consistency and improve data quality.
                        </Typography>

                        <Typography variant="body1" paragraph>
                            <strong>Features:</strong>
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                            • <strong>Autocomplete Search:</strong> Real-time search with category grouping<br />
                            • <strong>Common Aliases:</strong> Includes alternative names and abbreviations<br />
                            • <strong>Category Organization:</strong> Logical grouping by medical specialty<br />
                            • <strong>Validation:</strong> Ensures only valid surgery types are entered<br />
                            • <strong>Responsive Design:</strong> Works seamlessly on all devices
                        </Typography>

                        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                            <strong>Usage:</strong> The autocomplete component is now used in all forms where surgery types are entered, including the Edit Patient form and inline editing in the Patients list.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
