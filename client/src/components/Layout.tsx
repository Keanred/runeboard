import BoltIcon from '@mui/icons-material/Bolt';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { SideNav, SIDENAV_WIDTH } from './SideNav';
import { TopNav } from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SideNav />
      <TopNav />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          ml: `${SIDENAV_WIDTH}px`,
          mt: '64px',
          width: `calc(100% - ${SIDENAV_WIDTH}px)`,
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>

      {/* Floating Action Button */}
      <Fab
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.light})`,
          color: 'primary.dark',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <BoltIcon />
      </Fab>
    </Box>
  );
};
