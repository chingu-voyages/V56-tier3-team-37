'use client';

import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert
} from '@mui/material';
import {
    Warning as WarningIcon,
    ContactSupport as ContactSupportIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface RestrictionPopupProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actionText?: string;
}

export default function RestrictionPopup({
    open,
    onClose,
    title,
    message,
    actionText = "I Understand"
}: RestrictionPopupProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden'
                }
            }}
        >
            {/* Header with gradient background */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white',
                    p: 3,
                    textAlign: 'center'
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <WarningIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {title}
                    </Typography>
                </motion.div>
            </Box>

            {/* Content */}
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <ContactSupportIcon
                        sx={{
                            fontSize: 64,
                            color: '#6B7280',
                            mb: 2,
                            opacity: 0.7
                        }}
                    />
                </Box>

                <Alert
                    severity="warning"
                    sx={{
                        mb: 2,
                        '& .MuiAlert-message': {
                            fontSize: '1rem',
                            lineHeight: 1.6
                        }
                    }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {message}
                    </Typography>
                </Alert>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        bgcolor: '#EF4444',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: '#DC2626'
                        }
                    }}
                >
                    {actionText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
