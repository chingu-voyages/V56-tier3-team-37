'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, Chip, Divider } from '@mui/material';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/user-roles';
import FloatingChat from '@/components/FloatingChat';

export default function ChatbotDemoPage() {
    const { userRole, user } = useAuth();
    const [testMessage, setTestMessage] = useState('');
    const [testResponse, setTestResponse] = useState('');

    const testChatAPI = async () => {
        if (!testMessage.trim()) return;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: testMessage,
                    userRole: userRole
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            setTestResponse(data.response);
        } catch (error) {
            console.error('Error testing chat API:', error);
            setTestResponse('Error: Failed to get response from AI');
        }
    };

    const getRoleDescription = () => {
        switch (userRole) {
            case UserRole.ADMIN:
                return 'Administrator - Can search by patient names or codes';
            case UserRole.SURGICAL_TEAM:
                return 'Surgical Team - Can only search by patient codes';
            case UserRole.GUEST:
                return 'Guest - Can only search by patient codes';
            default:
                return 'Unknown role';
        }
    };

    const getPrivacyFeatures = () => {
        if (userRole === UserRole.ADMIN) {
            return [
                '✅ Can search patients by name',
                '✅ Can search patients by code',
                '✅ Can see patient names in responses',
                '🔓 Full access for administrative convenience'
            ];
        } else {
            return [
                '❌ Cannot search patients by name',
                '✅ Can search patients by code only',
                '🔒 Restricted access for privacy',
                '🔐 Patient codes work like passwords'
            ];
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h3" sx={{ mb: 3, color: '#07BEB8', fontWeight: 'bold' }}>
                Enhanced Chatbot Privacy Demo
            </Typography>

            <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8fafc' }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#1f2937' }}>
                    Current User Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <Chip
                        label={userRole.toUpperCase()}
                        color={userRole === UserRole.ADMIN ? 'success' : 'default'}
                        sx={{ fontWeight: 'bold' }}
                    />
                    <Typography variant="body1">
                        {user ? user.email : 'Not authenticated'}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {getRoleDescription()}
                </Typography>
            </Paper>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                {/* Privacy Features */}
                <Paper sx={{ p: 3, backgroundColor: '#f0f9ff' }}>
                    <Typography variant="h5" sx={{ mb: 2, color: '#0369a1' }}>
                        Privacy Features
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {getPrivacyFeatures().map((feature, index) => (
                            <Typography key={index} variant="body2" sx={{ color: '#0c4a6e' }}>
                                {feature}
                            </Typography>
                        ))}
                    </Box>
                </Paper>

                {/* Test Chat API */}
                <Paper sx={{ p: 3, backgroundColor: '#fefce8' }}>
                    <Typography variant="h5" sx={{ mb: 2, color: '#a16207' }}>
                        Test Chat API
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Test Message"
                            placeholder={userRole === UserRole.ADMIN
                                ? "Try: 'How is John Smith?' or 'Check ABC123'"
                                : "Try: 'Check ABC123' (codes only)"
                            }
                            value={testMessage}
                            onChange={(e) => setTestMessage(e.target.value)}
                            multiline
                            rows={3}
                        />
                        <Button
                            variant="contained"
                            onClick={testChatAPI}
                            sx={{ backgroundColor: '#07BEB8' }}
                        >
                            Test API
                        </Button>
                        {testResponse && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    AI Response:
                                </Typography>
                                <Paper sx={{ p: 2, backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {testResponse}
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>

            <Paper sx={{ p: 3, mt: 4, backgroundColor: '#fdf2f8' }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#be185d' }}>
                    How It Works
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1" sx={{ color: '#831843' }}>
                        <strong>Privacy-First Design:</strong> The chatbot now enforces strict privacy controls based on user roles.
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#831843' }}>
                        <strong>Role-Based Access:</strong> Only administrators can search by patient names, while all users can search by patient codes.
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#831843' }}>
                        <strong>Role-Based Patient Privacy:</strong> Administrators can see patient names for convenience, while guests must use patient codes for privacy protection.
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#831843' }}>
                        <strong>Secure Communication:</strong> Patient codes work like passwords, ensuring only those with the code can access information.
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#831843' }}>
                        <strong>Personalized Experience:</strong> Each user role receives a personalized greeting for enhanced user experience.
                    </Typography>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 4, backgroundColor: '#ecfdf5' }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#047857' }}>
                    Example Scenarios
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#065f46' }}>
                            For Administrators:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', ml: 2 }}>
                            • "How is John Smith doing?" → Searches by name, responds with "John Smith is currently in recovery"
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', ml: 2 }}>
                            • "Check status for ABC123" → Searches by code, responds with "John Smith is currently in recovery"
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#065f46' }}>
                            For Guests/Surgical Team:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', ml: 2 }}>
                            • "How is John Smith doing?" → Blocked, explains code-only search requirement
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', ml: 2 }}>
                            • "Check status for ABC123" → Searches by code, responds with "Patient ABC123 is..."
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#065f46' }}>
                            Personalized Greetings:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', ml: 2 }}>
                            • <strong>Admin:</strong> "Hello Admin! I'm your AI assistant..."
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', ml: 2 }}>
                            • <strong>Surgical Team:</strong> "Hello Surgical Team! I'm your AI assistant..."
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', ml: 2 }}>
                            • <strong>Guest:</strong> "Hello! I'm your AI assistant..." (standard greeting)
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 2, color: '#6b7280', textAlign: 'center' }}>
                Try the floating chatbot below to test these privacy features in real-time!
            </Typography>

            {/* Floating Chat Component */}
            <FloatingChat />
        </Box>
    );
}
