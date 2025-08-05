'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHub } from '@mui/icons-material';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Link,
  Avatar
} from '@mui/material';
import { Person, Person2 } from '@mui/icons-material';

interface TeamMember {
  name: string;
  github: string;
  linkedin?: string;
  role: 'Developer' | 'UI/UX Designer' | 'Scrum Master' | 'Product Owner';
  gender: 'male' | 'female';
}

const teamMembers: TeamMember[] = [
  { name: 'Cristian Torres', github: 'https://github.com/cristiantorresf19191919', role: 'Developer', gender: 'male' },
  { name: 'Vincent Bui', github: 'https://github.com/VincentBui0', linkedin: 'https://www.linkedin.com/in/vincent-bui0', role: 'Developer', gender: 'male' },
  { name: 'Jessica Hackett', github: 'https://github.com/mooglemoxie0018', linkedin: 'https://www.linkedin.com/in/jessica-hackett/', role: 'UI/UX Designer', gender: 'female' },
  { name: 'Ruth Igwe-Oruta', github: 'https://github.com/Xondacc', linkedin: 'https://www.linkedin.com/in/ruthigwe-oruta/', role: 'Product Owner', gender: 'female' },
  { name: 'Dorene St.Marthe', github: 'https://github.com/Dorene-StMarthe/', linkedin: 'https://www.linkedin.com/in/dorenestmarthe/', role: 'Scrum Master', gender: 'female' },
];

const roleColors = {
  'Developer': '#07BEB8',
  'UI/UX Designer': '#FF6B6B',
  'Scrum Master': '#4ECDC4',
  'Product Owner': '#45B7D1'
};

export default function Footer() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const groupedMembers = teamMembers.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <>
      <footer className="footer">
        <div className="footer__container max-w-7xl mx-auto flex justify-between items-center">
          {/* GitHub Logo on Left */}
          <Link
            href="https://github.com/chingu-voyages/V56-tier3-team-37"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 transition-colors cursor-pointer"
          >
            <GitHub sx={{ fontSize: 28, color: 'white' }} />
          </Link>

          {/* Credits Label on Right */}
          <motion.p
            onClick={() => setDrawerOpen(true)}
            style={{
              color: 'white',
              fontWeight: 'medium',
            }}
            className="text-white transition-colors font-medium cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Credits
          </motion.p>
        </div>
      </footer>

      {/* Credits Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                maxHeight: '70vh',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: '#ffffff',
                color: '#1f2937',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.05)',
                width: '100%'
              }
            }}
            transitionDuration={300}
            SlideProps={{
              direction: 'up',
              timeout: 300
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', letterSpacing: '-0.5px' }}>
                  Team Credits
                </Typography>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    '&:hover': {
                      backgroundColor: '#e5e7eb',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, fontSize: '1.2rem' }}>×</Typography>
                </IconButton>
              </Box>

              {/* Team Members by Role */}
              <List>
                {Object.entries(groupedMembers).map(([role, members], roleIndex) => (
                  <Box key={role}>
                    {/* Role Header */}
                    <Box sx={{ mb: 2, mt: 1 }}>
                      <Chip
                        label={role}
                        sx={{
                          backgroundColor: roleColors[role as keyof typeof roleColors],
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                          '& .MuiChip-label': {
                            padding: '0 6px'
                          }
                        }}
                      />
                    </Box>

                    {/* Members in this role */}
                    {members.map((member, memberIndex) => (
                      <ListItem
                        key={member.name}
                        sx={{
                          py: { xs: 1.5, sm: 2 },
                          px: { xs: 1.5, sm: 2 },
                          mb: 1,
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e5e7eb',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #d1d5db',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'all 0.2s ease'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                              <Avatar
                                sx={{
                                  width: { xs: 28, sm: 32 },
                                  height: { xs: 28, sm: 32 },
                                  backgroundColor: '#14b8a6',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                                }}
                              >
                                {member.gender === 'male' ? (
                                  <Person sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                ) : (
                                  <Person2 sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                )}
                              </Avatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                  {member.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Link
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      color: '#ffffff',
                                      textDecoration: 'none',
                                      backgroundColor: '#14b8a6',
                                      padding: { xs: '3px 8px', sm: '4px 10px' },
                                      borderRadius: '12px',
                                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                      fontWeight: 600,
                                      '&:hover': {
                                        backgroundColor: '#0d9488',
                                        textDecoration: 'none',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 1px 4px rgba(20, 184, 166, 0.3)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    GitHub
                                  </Link>
                                  {member.linkedin && (
                                    <>
                                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                                        /
                                      </Typography>
                                      <Link
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                          color: '#ffffff',
                                          textDecoration: 'none',
                                          backgroundColor: '#0077b5',
                                          padding: { xs: '3px 8px', sm: '4px 10px' },
                                          borderRadius: '12px',
                                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                          fontWeight: 600,
                                          '&:hover': {
                                            backgroundColor: '#005885',
                                            textDecoration: 'none',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 1px 4px rgba(0, 119, 181, 0.3)'
                                          },
                                          transition: 'all 0.2s ease'
                                        }}
                                      >
                                        LinkedIn
                                      </Link>
                                    </>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}

                    {/* Divider between roles (except after last role) */}
                    {roleIndex < Object.keys(groupedMembers).length - 1 && (
                      <Divider sx={{ my: 2, opacity: 0.3, borderColor: '#e5e7eb' }} />
                    )}
                  </Box>
                ))}
              </List>

              {/* Footer note */}
              <Box sx={{
                mt: 2,
                pt: 2,
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                p: 2
              }}>
                <Typography variant="body1" sx={{
                  color: '#6b7280',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  fontWeight: 500
                }}>
                  Reducing stress through real-time surgery updates and workflow transparency.
                </Typography>
              </Box>
            </Box>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
}
