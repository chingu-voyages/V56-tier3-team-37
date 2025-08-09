'use client';

import { motion } from 'framer-motion';
import { Box, Typography, CircularProgress } from '@mui/material';

interface AnimatedLoadingProps {
    message?: string;
    size?: number;
}

export default function AnimatedLoading({
    message = 'Loading...',
    size = 60
}: AnimatedLoadingProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                p: 4
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
            >
                <CircularProgress
                    size={size}
                    sx={{
                        color: '#07BEB8',
                        mb: 2
                    }}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
            >
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}
                >
                    {message}
                </Typography>
            </motion.div>
        </Box>
    );
} 