'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonProps {
    children: ReactNode;
    delay?: number;
}

export default function AnimatedButton({
    children,
    delay = 0,
    sx,
    ...props
}: AnimatedButtonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.3,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button
                {...props}
                sx={{
                    ...sx,
                    transition: 'all 0.2s ease'
                }}
            >
                {children}
            </Button>
        </motion.div>
    );
} 