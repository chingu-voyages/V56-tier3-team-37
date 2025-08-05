'use client';

import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface InlineLoaderProps {
    size?: number;
    color?: string;
}

export default function InlineLoader({
    size = 20,
    color = '#07BEB8'
}: InlineLoaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress
                    size={size}
                    thickness={3}
                    sx={{
                        color: color,
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        },
                    }}
                />
            </Box>
        </motion.div>
    );
} 