import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export type ColumnHeaderProps = {
  /** Column heading text */
  title: string;
  /** Number shown in the badge next to the title */
  count: number;
  /** Show the "+" add button in the header */
  showAdd?: boolean;
  /** Called when the "+" header button is clicked */
  onAdd?: () => void;
}

export const ColumnHeader = ({ title, count, showAdd = false, onAdd }: ColumnHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        px: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 700,
            fontSize: '1.125rem',
            color: 'onSurface.main',
          }}
        >
          {title}
        </Typography>
        <Chip
          label={count}
          size="small"
          sx={{
            height: 20,
            fontSize: '10px',
            fontWeight: 700,
            bgcolor: 'surface.containerHigh',
            color: 'tertiary.main',
            '& .MuiChip-label': { px: 1 },
          }}
        />
      </Box>
      {showAdd && (
        <IconButton size="small" onClick={onAdd} sx={{ color: 'muted', '&:hover': { color: 'onSurface.main' } }}>
          <AddIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
