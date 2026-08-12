import React from 'react';
import { Box, Container, Typography, Divider, Stack, Chip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SchoolIcon sx={{ color: '#6366F1', fontSize: 22 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Teacher &copy; {new Date().getFullYear()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Secure Admin Portal
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Chip
              label="v1.0 MUI"
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#818CF8',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
