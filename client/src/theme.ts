import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
      dim: string;
      bright: string;
      containerLowest: string;
      containerLow: string;
      container: string;
      containerHigh: string;
      containerHighest: string;
      variant: string;
    };
    onSurface: {
      main: string;
      variant: string;
    };
    onBackground: string;
    outline: {
      main: string;
      variant: string;
    };
    tertiary: {
      main: string;
      container: string;
    };
    muted: string;
  }
  interface PaletteOptions {
    surface?: {
      main: string;
      dim: string;
      bright: string;
      containerLowest: string;
      containerLow: string;
      container: string;
      containerHigh: string;
      containerHighest: string;
      variant: string;
    };
    onSurface?: {
      main: string;
      variant: string;
    };
    onBackground?: string;
    outline?: {
      main: string;
      variant: string;
    };
    tertiary?: {
      main: string;
      container: string;
    };
    muted?: string;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bd93f9',
      light: '#d7baff',
      dark: '#714aaa',
    },
    secondary: {
      main: '#b5c5fc',
      dark: '#374776',
    },
    error: {
      main: '#ffb4ab',
      dark: '#93000a',
    },
    success: {
      main: '#4ade80',
    },
    background: {
      default: '#11131e',
      paper: '#191b26',
    },
    surface: {
      main: '#11131e',
      dim: '#11131e',
      bright: '#373845',
      containerLowest: '#0b0e18',
      containerLow: '#191b26',
      container: '#1d1f2b',
      containerHigh: '#272935',
      containerHighest: '#323440',
      variant: '#323440',
    },
    onSurface: {
      main: '#e1e1f1',
      variant: '#ccc3d3',
    },
    onBackground: '#e1e1f1',
    outline: {
      main: '#968e9c',
      variant: '#4a4451',
    },
    tertiary: {
      main: '#75d4e8',
      container: '#53b4c7',
    },
    muted: '#6272a4',
    text: {
      primary: '#e1e1f1',
      secondary: '#ccc3d3',
      disabled: '#6272a4',
    },
    divider: 'rgba(68, 71, 90, 0.3)',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Manrope", sans-serif' },
    h2: { fontFamily: '"Manrope", sans-serif' },
    h3: { fontFamily: '"Manrope", sans-serif' },
    h4: { fontFamily: '"Manrope", sans-serif' },
    h5: { fontFamily: '"Manrope", sans-serif' },
    h6: { fontFamily: '"Manrope", sans-serif' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#11131e',
          color: '#e1e1f1',
        },
        '::-webkit-scrollbar': {
          width: '4px',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#44475a',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#6272a4',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
