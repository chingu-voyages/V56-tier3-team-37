'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    IconButton,
    Drawer,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    SmartToy as AIIcon,
    Send as SendIcon,
    Close as CloseIcon,
    Chat as ChatIcon,
    Fullscreen as MaximizeIcon,
    FullscreenExit as MinimizeIcon
} from '@mui/icons-material';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/user-roles';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    patientQuery?: {
        query: string;
        type: 'name' | 'id';
        found: boolean;
        resultType: 'single' | 'multiple' | null;
        allowed?: boolean;
    } | null;
}

export default function FloatingChat() {
    const { userRole } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your AI assistant. I can help you with healthcare questions, surgery information, and patient status lookups. For privacy, I can only search by patient codes (6-character format like ABC123). How can I help you today?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Sophisticated animation state management
    const [animationState, setAnimationState] = useState<'idle' | 'pulse' | 'wave' | 'blink'>('idle');
    const [isVisible, setIsVisible] = useState(false);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastUserActivityRef = useRef<number>(Date.now());

    // Update welcome message based on user role
    useEffect(() => {
        if (userRole === UserRole.ADMIN) {
            setMessages(prev => prev.map(msg =>
                msg.id === '1'
                    ? { ...msg, text: 'Hello Admin! I\'m your AI assistant. I can help you with healthcare questions, surgery information, and patient status lookups. As an administrator, you can search by patient names or codes and get direct results. How can I help you today?' }
                    : msg
            ));
        } else if (userRole === UserRole.SURGICAL_TEAM) {
            setMessages(prev => prev.map(msg =>
                msg.id === '1'
                    ? { ...msg, text: 'Hello Surgical Team! I\'m your AI assistant. I can help you with healthcare questions, surgery information, and patient status lookups. For privacy, I can only search by patient codes (6-character format like ABC123). How can I help you today?' }
                    : msg
            ));
        } else {
            setMessages(prev => prev.map(msg =>
                msg.id === '1'
                    ? { ...msg, text: 'Hello! I\'m your AI assistant. I can help you with healthcare questions, surgery information, and patient status lookups. For privacy, I can only search by patient codes (6-character format like ABC123). How can I help you today?' }
                    : msg
            ));
        }
    }, [userRole]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    userRole: userRole
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || 'I received your message! This is a placeholder response.',
                sender: 'ai',
                timestamp: new Date(),
                patientQuery: data.patientQuery || null
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Sophisticated periodic animation system
    useEffect(() => {
        const updateUserActivity = () => {
            lastUserActivityRef.current = Date.now();
        };

        // Track user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, updateUserActivity);
        });

        // Periodic animation logic
        const scheduleNextAnimation = () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }

            // Calculate time since last user activity
            const timeSinceActivity = Date.now() - lastUserActivityRef.current;
            const isUserInactive = timeSinceActivity > 180000; // 3 minutes

            // Determine next animation based on context
            let nextAnimationDelay: number;
            let nextAnimation: 'pulse' | 'wave' | 'blink';

            if (isUserInactive) {
                // User inactive - more frequent, engaging animations
                nextAnimationDelay = 30000 + Math.random() * 30000; // 30-60 seconds
                nextAnimation = Math.random() > 0.7 ? 'wave' : 'pulse';
            } else {
                // User active - subtle, professional animations
                nextAnimationDelay = 60000 + Math.random() * 60000; // 60-120 seconds
                nextAnimation = Math.random() > 0.8 ? 'blink' : 'pulse';
            }

            animationTimeoutRef.current = setTimeout(() => {
                if (isVisible && !drawerOpen) {
                    setAnimationState(nextAnimation);

                    // Reset to idle after animation
                    setTimeout(() => setAnimationState('idle'), 2000);

                    // Schedule next animation
                    scheduleNextAnimation();
                } else {
                    // If not visible or drawer open, try again later
                    scheduleNextAnimation();
                }
            }, nextAnimationDelay);
        };

        // Start animation cycle
        scheduleNextAnimation();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, updateUserActivity);
            });
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [isVisible, drawerOpen]);

    // Visibility detection for smart animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);

                // Welcome animation when becoming visible
                if (entry.isIntersecting && !drawerOpen) {
                    setTimeout(() => {
                        setAnimationState('pulse');
                        setTimeout(() => setAnimationState('idle'), 2000);
                    }, 1000);
                }
            },
            { threshold: 0.1 }
        );

        const buttonElement = document.querySelector('[data-robot-button]');
        if (buttonElement) {
            observer.observe(buttonElement);
        }

        return () => observer.disconnect();
    }, [drawerOpen]);

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <motion.div
                data-robot-button
                style={{
                    position: 'fixed',
                    bottom: 100, // Above the footer
                    right: 20,
                    zIndex: 1000,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animationState}
                variants={{
                    idle: {
                        scale: 1,
                        rotate: 0,
                        filter: 'brightness(1)',
                        transition: { duration: 0.5, ease: 'easeInOut' }
                    },
                    pulse: {
                        scale: [1, 1.05, 1],
                        filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
                        boxShadow: [
                            '0 4px 20px rgba(7, 190, 184, 0.3)',
                            '0 6px 30px rgba(7, 190, 184, 0.5)',
                            '0 4px 20px rgba(7, 190, 184, 0.3)'
                        ],
                        transition: {
                            duration: 2,
                            ease: 'easeInOut',
                            times: [0, 0.5, 1]
                        }
                    },
                    wave: {
                        rotate: [0, -5, 5, -5, 0],
                        scale: [1, 1.02, 1.02, 1.02, 1],
                        transition: {
                            duration: 2,
                            ease: 'easeInOut',
                            times: [0, 0.2, 0.5, 0.8, 1]
                        }
                    },
                    blink: {
                        scale: [1, 1.02, 1],
                        filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
                        transition: {
                            duration: 1.5,
                            ease: 'easeInOut',
                            times: [0, 0.3, 1]
                        }
                    }
                }}

            >
                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                        background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                        color: 'white',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <AIIcon sx={{ fontSize: 28 }} />
                </IconButton>
            </motion.div>

            {/* Chat Drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <Drawer
                        anchor="right"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        PaperProps={{
                            sx: {
                                width: isMaximized ? '100%' : { xs: '100%', sm: 400 },
                                maxWidth: '100vw',
                                backgroundColor: '#ffffff',
                                borderLeft: isMaximized ? 'none' : '1px solid rgba(7, 190, 184, 0.1)',
                                boxShadow: isMaximized ? 'none' : '-4px 0 20px rgba(0,0,0,0.1)',
                                height: isMaximized ? '100vh' : 'auto',
                                position: isMaximized ? 'fixed' : 'fixed',
                                top: isMaximized ? 0 : 'auto',
                                right: isMaximized ? 0 : '0',
                                left: isMaximized ? 'auto' : 'auto',
                                ...(!isMaximized && {
                                    bottom: 0,
                                    top: 0
                                }),
                                zIndex: isMaximized ? 9999 : 1000,
                                transform: isMaximized ? 'none' : 'translateX(0)',
                                '&.MuiDrawer-paper': {
                                    right: 0,
                                    left: 'auto !important'
                                }
                            }
                        }}
                        transitionDuration={300}
                    >
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Header */}
                            <Box sx={{
                                p: 3,
                                borderBottom: '1px solid #e5e7eb',
                                background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                                color: 'white'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            width: 40,
                                            height: 40
                                        }}>
                                            <AIIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                AI Assistant
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {userRole === UserRole.ADMIN
                                                    ? "Ask me anything! I can look up patient status by name or code and get direct results."
                                                    : "Ask me anything! I can look up patient status by code only."
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            onClick={toggleMaximize}
                                            sx={{
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                                }
                                            }}
                                        >
                                            {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
                                        </IconButton>
                                        <IconButton
                                            onClick={() => setDrawerOpen(false)}
                                            sx={{
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                                }
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Messages */}
                            <Box sx={{
                                flex: 1,
                                overflow: 'auto',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <AnimatePresence>
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                                mb: 2
                                            }}>
                                                <Box sx={{
                                                    maxWidth: '80%',
                                                    display: 'flex',
                                                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                                                    alignItems: 'flex-start',
                                                    gap: 1
                                                }}>
                                                    <Avatar sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: message.sender === 'user' ? '#07BEB8' : '#6B7280',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        {message.sender === 'user' ? 'U' : <AIIcon sx={{ fontSize: 16 }} />}
                                                    </Avatar>
                                                    <Paper sx={{
                                                        p: 2,
                                                        backgroundColor: message.sender === 'user'
                                                            ? 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)'
                                                            : '#f8fafc',
                                                        color: '#1f2937',
                                                        borderRadius: 2,
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        maxWidth: '100%',
                                                        wordBreak: 'break-word'
                                                    }}>
                                                        {/* Patient Query Indicator */}
                                                        {message.patientQuery && (
                                                            <Box sx={{
                                                                mb: 1,
                                                                p: 1,
                                                                backgroundColor: message.patientQuery.allowed === false ? '#FEF3C7' :
                                                                    message.patientQuery.found ? '#D1FAE5' : '#FEE2E2',
                                                                borderRadius: 1,
                                                                border: `1px solid ${message.patientQuery.allowed === false ? '#F59E0B' :
                                                                    message.patientQuery.found ? '#10B981' : '#EF4444'}`
                                                            }}>
                                                                <Typography variant="caption" sx={{
                                                                    fontWeight: 600,
                                                                    color: message.patientQuery.allowed === false ? '#92400E' :
                                                                        message.patientQuery.found ? '#065F46' : '#991B1B'
                                                                }}>
                                                                    🔍 Patient Lookup: {message.patientQuery.query}
                                                                    {message.patientQuery.allowed === false
                                                                        ? ' - Search restricted (code only)'
                                                                        : message.patientQuery.found
                                                                            ? ` - ${message.patientQuery.resultType === 'single' ? 'Found' : 'Multiple matches'}`
                                                                            : ' - Not found'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        <Typography variant="body1" sx={{
                                                            fontWeight: 500,
                                                            lineHeight: 1.5,
                                                            color: '#1f2937'
                                                        }}>
                                                            {message.text}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            opacity: 0.7,
                                                            mt: 1,
                                                            display: 'block',
                                                            color: '#1f2937'
                                                        }}>
                                                            {message.timestamp.toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Loading indicator */}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            p: 2,
                                            backgroundColor: '#f8fafc',
                                            borderRadius: 2,
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <CircularProgress size={16} sx={{ color: '#07BEB8' }} />
                                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                                AI is thinking...
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                )}
                            </Box>

                            {/* Input */}
                            <Box sx={{
                                p: 2,
                                borderTop: '1px solid #e5e7eb',
                                backgroundColor: '#fafafa'
                            }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        placeholder={userRole === UserRole.ADMIN
                                            ? "Type your message... (e.g., 'How is John Smith?' or 'Check ABC123')"
                                            : "Type your message... (e.g., 'Check ABC123' - patient codes only)"
                                        }
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading}
                                        multiline
                                        maxRows={3}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'white',
                                                borderRadius: 2,
                                                '& fieldset': {
                                                    borderColor: '#e5e7eb'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#07BEB8'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#07BEB8'
                                                }
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim() || isLoading}
                                        sx={{
                                            minWidth: 48,
                                            height: 48,
                                            backgroundColor: '#07BEB8',
                                            color: 'white',
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: '#059B96'
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#9CA3AF'
                                            }
                                        }}
                                    >
                                        <SendIcon />
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Drawer>
                )}
            </AnimatePresence>
        </>
    );
}
