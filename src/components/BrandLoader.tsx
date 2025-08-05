'use client';

import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface BrandLoaderProps {
    size?: number;
    message?: string;
    fullScreen?: boolean;
}

export default function BrandLoader({
    size = 80,
    message = "Loading...",
    fullScreen = false
}: BrandLoaderProps) {
    const containerStyle = fullScreen ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
    } : {};

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: fullScreen ? '100vh' : '200px',
                    ...containerStyle
                }}
            >
                {/* Main Spinner */}
                <Box sx={{ position: 'relative', mb: 2 }}>
                    <CircularProgress
                        size={size}
                        thickness={4}
                        sx={{
                            color: '#07BEB8',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            },
                        }}
                    />

                    {/* Inner Pulse Effect */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: size * 0.6,
                            height: size * 0.6,
                            borderRadius: '50%',
                            backgroundColor: '#07BEB8',
                            opacity: 0.3,
                        }}
                    />
                </Box>

                {/* Loading Message */}
                <motion.div
                    animate={{
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Box
                        sx={{
                            color: '#07BEB8',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {message}
                    </Box>
                </motion.div>

                {/* Dots Animation */}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            animate={{
                                y: [0, -8, 0],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: "easeInOut"
                            }}
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: '#07BEB8',
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </motion.div>
    );
} 