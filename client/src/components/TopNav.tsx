import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SIDENAV_WIDTH } from './SideNav';

const viewTabs = ['Board', 'Timeline', 'Calendar', 'Activity'];

interface TopNavProps {
  activeTab?: number;
  onTabChange?: (index: number) => void;
}

export const TopNav = ({ activeTab = 0, onTabChange }: TopNavProps) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${SIDENAV_WIDTH}px)`,
        ml: `${SIDENAV_WIDTH}px`,
        bgcolor: 'rgba(17, 19, 30, 0.7)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
        borderBottom: 'none',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 5 }, minHeight: 64 }}>
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'onSurface.main',
            }}
          >
            Board View
          </Typography>
          <Tabs
            value={activeTab}
            onChange={(_, v) => onTabChange?.(v)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              minHeight: 0,
              '& .MuiTab-root': {
                minHeight: 0,
                py: 1,
                px: 0,
                mr: 3,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'muted',
                textTransform: 'none',
                '&.Mui-selected': { color: 'primary.main' },
              },
              '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
            }}
          >
            {viewTabs.map((tab) => (
              <Tab key={tab} label={tab} disableRipple />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search boards..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'muted', fontSize: '1rem' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: 256,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'surface.containerHighest',
                borderRadius: 1,
                fontSize: '0.75rem',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': {
                  border: '1px solid',
                  borderColor: 'rgba(189, 147, 249, 0.3)',
                },
              },
            }}
          />

          <Button
            startIcon={<FilterListIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              color: 'onSurface.main',
              fontSize: '0.875rem',
              '&:hover': { bgcolor: 'surface.containerLow' },
            }}
          >
            Filter
          </Button>

          <Button
            variant="contained"
            sx={{
              bgcolor: 'rgba(189, 147, 249, 0.1)',
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.875rem',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'rgba(189, 147, 249, 0.2)',
                boxShadow: 'none',
              },
            }}
          >
            Share
          </Button>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ml: 2,
              pl: 2,
              borderLeft: 1,
              borderColor: 'rgba(68, 71, 90, 0.3)',
            }}
          >
            <IconButton sx={{ color: 'muted', '&:hover': { color: 'onSurface.main' } }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton sx={{ color: 'muted', '&:hover': { color: 'onSurface.main' } }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
