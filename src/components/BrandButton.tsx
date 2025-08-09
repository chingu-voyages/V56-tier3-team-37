'use client';

import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BrandButtonProps extends Omit<ButtonProps, 'variant'> {
    children: ReactNode;
    delay?: number;
}

export default function BrandButton({
    children,
    delay = 0,
    sx,
    ...props
}: BrandButtonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.3,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Button
                {...props}
                sx={{
                    // Base styles
                    borderRadius: '50px', // Pill-like shape with significantly rounded corners
                    px: 4,
                    py: 1, // Reduced vertical padding
                    minHeight: 40, // Reduced minimum height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    // Solid teal background (no gradients)
                    background: '#07BEB8',

                    // Text styles
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                    letterSpacing: '0.5px',
                    textAlign: 'center',

                    // Drop shadow
                    boxShadow: '0 4px 12px rgba(7, 190, 184, 0.3)',

                    // Hover effects (solid color, no gradients)
                    '&:hover': {
                        background: '#059B96',
                        boxShadow: '0 6px 20px rgba(7, 190, 184, 0.4)',
                        transform: 'translateY(-1px)'
                    },

                    // Focus effects
                    '&:focus': {
                        boxShadow: '0 0 0 3px rgba(7, 190, 184, 0.2), 0 4px 12px rgba(7, 190, 184, 0.3)'
                    },

                    // Active effects
                    '&:active': {
                        transform: 'translateY(0px)',
                        boxShadow: '0 2px 8px rgba(7, 190, 184, 0.3)'
                    },

                    // Disabled state (solid color, no gradients)
                    '&:disabled': {
                        background: '#9CA3AF',
                        color: 'rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                        transform: 'none'
                    },

                    // Smooth transitions
                    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',

                    // Custom styles override
                    ...sx
                }}
            >
                {children}
            </Button>
        </motion.div>
    );
} 