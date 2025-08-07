'use client';

import { useState } from 'react';
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
    Chat as ChatIcon
} from '@mui/icons-material';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function FloatingChat() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your AI assistant. How can I help you today?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                body: JSON.stringify({ message: inputMessage }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || 'I received your message! This is a placeholder response.',
                sender: 'ai',
                timestamp: new Date()
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

    return (
        <>
            {/* Floating Chat Button */}
            <motion.div
                style={{
                    position: 'fixed',
                    bottom: 100, // Above the footer
                    right: 20,
                    zIndex: 1000,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                        background: 'linear-gradient(135deg, #07BEB8 0%, #3DCCC7 100%)',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(7, 190, 184, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #059B96 0%, #07BEB8 100%)',
                            boxShadow: '0 6px 25px rgba(7, 190, 184, 0.4)',
                        },
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
                                width: { xs: '100%', sm: 400 },
                                maxWidth: '100vw',
                                backgroundColor: '#ffffff',
                                borderLeft: '1px solid rgba(7, 190, 184, 0.1)',
                                boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
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
                                                Ask me anything!
                                            </Typography>
                                        </Box>
                                    </Box>
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
                                                        color: message.sender === 'user' ? 'white' : '#1f2937',
                                                        borderRadius: 2,
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        maxWidth: '100%',
                                                        wordBreak: 'break-word'
                                                    }}>
                                                        <Typography variant="body1" sx={{
                                                            fontWeight: 500,
                                                            lineHeight: 1.5
                                                        }}>
                                                            {message.text}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            opacity: 0.7,
                                                            mt: 1,
                                                            display: 'block'
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
                                        sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}
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
                                        placeholder="Type your message..."
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
