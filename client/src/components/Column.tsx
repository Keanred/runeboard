import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export interface ColumnProps {
  /** Column heading text */
  title: string;
  /** Number shown in the badge next to the title */
  count: number;
  /** Show the "+" add button in the header */
  showAdd?: boolean;
  /** Called when the "+" header button is clicked */
  onAdd?: () => void;
  /** Drop-zone callbacks for drag-and-drop support */
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  /** The TaskCard elements (or any children) rendered inside the column */
  children?: React.ReactNode;
}

export const Column = ({ title, count, showAdd = false, onAdd, onDragOver, onDrop, children }: ColumnProps) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
        onDragOver?.(e);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onDrop?.(e);
      }}
      sx={{
        width: 320,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 3,
        transition: 'outline 0.2s',
        outline: dragOver ? '2px dashed' : '2px dashed transparent',
        outlineColor: dragOver ? 'primary.main' : 'transparent',
        outlineOffset: 4,
      }}
    >
      {/* Column Header */}
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

      {/* Task List */}
      <Stack
        spacing={2}
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
};
