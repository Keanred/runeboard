import AddIcon from '@mui/icons-material/Add';
import ArchiveIcon from '@mui/icons-material/Archive';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export const SIDENAV_WIDTH = 256;

const mainNavItems = [
  { label: 'All Boards', icon: <DashboardIcon fontSize="small" />, active: true },
  { label: 'Team Workspace', icon: <GroupIcon fontSize="small" /> },
  { label: 'Recent Files', icon: <HistoryIcon fontSize="small" /> },
  { label: 'Analytics', icon: <InsightsIcon fontSize="small" /> },
  { label: 'Archive', icon: <ArchiveIcon fontSize="small" /> },
];

const bottomNavItems = [
  { label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
  { label: 'Support', icon: <HelpOutlineIcon fontSize="small" /> },
];

export const SideNav = () => {
  return (
    <Box
      component="aside"
      sx={{
        width: SIDENAV_WIDTH,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: 'surface.containerLow',
        display: 'flex',
        flexDirection: 'column',
        py: 4,
        px: 2,
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      {/* Branding */}
      <Box sx={{ mb: 5, px: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            color: 'primary.main',
          }}
        >
          Runeboard
        </Typography>
        <Typography
          sx={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'muted',
            mt: 0.5,
          }}
        >
          Premium Workspace
        </Typography>
      </Box>

      {/* New Board Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        sx={{
          mb: 4,
          py: 1.5,
          background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.light})`,
          color: 'primary.dark',
          fontWeight: 600,
          '&:hover': {
            background: (t) => `linear-gradient(135deg, ${t.palette.primary.light}, ${t.palette.primary.main})`,
          },
        }}
      >
        New Board
      </Button>

      {/* Main Navigation */}
      <List component="nav" sx={{ flex: 1 }}>
        {mainNavItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.active}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              borderLeft: item.active ? '3px solid' : '3px solid transparent',
              borderColor: item.active ? 'primary.main' : 'transparent',
              bgcolor: item.active ? 'rgba(68, 71, 90, 0.3)' : 'transparent',
              color: item.active ? 'tertiary.main' : 'onSurface.variant',
              '&:hover': {
                bgcolor: 'surface.containerHigh',
                color: 'onSurface.main',
              },
              '&.Mui-selected': {
                bgcolor: 'rgba(68, 71, 90, 0.3)',
                '&:hover': { bgcolor: 'rgba(68, 71, 90, 0.4)' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: item.active ? 600 : 500 }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Bottom Section */}
      <Box sx={{ pt: 3, mt: 3, borderTop: 1, borderColor: 'rgba(68, 71, 90, 0.2)' }}>
        <List disablePadding>
          {bottomNavItems.map((item) => (
            <ListItemButton
              key={item.label}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                color: 'onSurface.variant',
                '&:hover': {
                  bgcolor: 'surface.containerHigh',
                  color: 'onSurface.main',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
            </ListItemButton>
          ))}
        </List>

        {/* User Profile */}
        <Box sx={{ mt: 2, px: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              border: '1px solid',
              borderColor: 'rgba(189, 147, 249, 0.2)',
            }}
          >
            A
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'onSurface.main',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Alex Rivers
            </Typography>
            <Typography
              sx={{
                fontSize: '10px',
                color: 'muted',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Pro Plan
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
