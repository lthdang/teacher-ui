import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';

export const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          textAlign: 'center',
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
            }}
          >
            <DashboardIcon sx={{ color: '#FFFFFF', fontSize: 34 }} />
          </Box>

          <Typography
            variant="h1"
            component="h1"
            id="dashboard-heading"
            sx={{
              background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.25rem', sm: '3rem' },
              mb: 1.5,
            }}
          >
            Dashboard
          </Typography>

          <Chip
            icon={<HourglassEmptyIcon sx={{ fontSize: '18px !important', color: '#FBBF24 !important' }} />}
            label="Coming Soon"
            id="dashboard-coming-soon"
            sx={{
              backgroundColor: 'rgba(251, 191, 36, 0.12)',
              color: '#FBBF24',
              borderColor: 'rgba(251, 191, 36, 0.3)',
              border: '1px solid',
              fontSize: '1rem',
              fontWeight: 600,
              px: 2,
              py: 2.2,
              borderRadius: '20px',
            }}
          />
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 5 }}>
          Teacher & Class Management features are under active development. Below is a preview of planned administrative modules.
        </Typography>

        {/* Feature Preview Grid */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <PeopleIcon sx={{ fontSize: 32, color: '#818CF8', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                  Teacher Roster
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage faculty profiles, subjects, and assignments.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <ClassOutlinedIcon sx={{ fontSize: 32, color: '#34D399', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                  Class Schedules
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Timetable coordination and classroom allocation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <AnalyticsOutlinedIcon sx={{ fontSize: 32, color: '#F472B6', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                  Analytics & Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System metrics, attendance log, and audit reports.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
