'use client';

import { Box, Typography, Container, Paper } from '@mui/material';
import BrandButton from '@/components/BrandButton';
import { motion } from 'framer-motion';

export default function ButtonDemoPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h3" component="h1" sx={{
                    mb: 4,
                    fontWeight: 700,
                    color: '#1F2937',
                    textAlign: 'center',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                }}>
                    Brand Button Demo
                </Typography>

                <Typography variant="h6" sx={{
                    mb: 6,
                    color: '#6B7280',
                    textAlign: 'center',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif'
                }}>
                    Showcasing the teal gradient button with rounded corners and smooth animations
                </Typography>

                {/* Basic Button */}
                <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1F2937' }}>
                        Basic Brand Button
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <BrandButton>
                            Continue
                        </BrandButton>
                    </Box>
                </Paper>

                {/* Multiple Buttons with Staggering */}
                <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1F2937' }}>
                        Multiple Buttons with Staggering Animation
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <BrandButton delay={0.1}>
                            Get Started
                        </BrandButton>
                        <BrandButton delay={0.2}>
                            Learn More
                        </BrandButton>
                        <BrandButton delay={0.3}>
                            Contact Us
                        </BrandButton>
                    </Box>
                </Paper>

                {/* Button States */}
                <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1F2937' }}>
                        Button States
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <BrandButton>
                            Normal State
                        </BrandButton>
                        <BrandButton disabled>
                            Disabled State
                        </BrandButton>
                    </Box>
                </Paper>

                {/* Different Sizes */}
                <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1F2937' }}>
                        Different Sizes
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                        <BrandButton sx={{ px: 2, py: 1, minHeight: 36, fontSize: '0.875rem' }}>
                            Small
                        </BrandButton>
                        <BrandButton>
                            Medium
                        </BrandButton>
                        <BrandButton sx={{ px: 6, py: 2, minHeight: 56, fontSize: '1.125rem' }}>
                            Large
                        </BrandButton>
                    </Box>
                </Paper>

                {/* Interactive Demo */}
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1F2937' }}>
                        Interactive Demo
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#6B7280', textAlign: 'center' }}>
                        Hover and click the buttons to see the smooth animations and effects
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <BrandButton onClick={() => alert('Button clicked!')}>
                            Click Me
                        </BrandButton>
                        <BrandButton onClick={() => console.log('Button pressed')}>
                            Console Log
                        </BrandButton>
                        <BrandButton onClick={() => window.open('https://example.com', '_blank')}>
                            External Link
                        </BrandButton>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
} 