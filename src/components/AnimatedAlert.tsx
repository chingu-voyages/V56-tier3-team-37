'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertProps } from '@mui/material';

interface AnimatedAlertProps extends AlertProps {
    show: boolean;
}

export default function AnimatedAlert({ show, children, ...props }: AnimatedAlertProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                >
                    <Alert {...props}>
                        {children}
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 