'use client';

import { motion } from 'framer-motion';
import { Box } from '@mui/material';

interface AnimatedHamburgerProps {
    isOpen: boolean;
    onClick: () => void;
}

export default function AnimatedHamburger({ isOpen, onClick }: AnimatedHamburgerProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                width: '40px',
                height: '40px',
                transition: 'background-color 0.2s ease'
            }}
            onHoverStart={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                if (target) {
                    target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }
            }}
            onHoverEnd={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                if (target) {
                    target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
            }}
        >
            {/* Top line */}
            <motion.div
                initial={false}
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                }}
                style={{
                    width: '20px',
                    height: '2px',
                    backgroundColor: 'white',
                    borderRadius: '1px',
                    transformOrigin: 'center'
                }}
            />

            {/* Middle line */}
            <motion.div
                initial={false}
                animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                }}
                style={{
                    width: '20px',
                    height: '2px',
                    backgroundColor: 'white',
                    borderRadius: '1px'
                }}
            />

            {/* Bottom line */}
            <motion.div
                initial={false}
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                }}
                style={{
                    width: '20px',
                    height: '2px',
                    backgroundColor: 'white',
                    borderRadius: '1px',
                    transformOrigin: 'center'
                }}
            />
        </motion.div>
    );
}
