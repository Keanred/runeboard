import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Column } from './Column';

export type BoardProps = {
  /** Called when the trailing "add column" button is clicked */
  onAddColumn?: () => void;
}

export const Board = ({ onAddColumn }: BoardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        height: '100%',
        minWidth: 'max-content',
        p: 5,
        overflowX: 'auto',
      }}
    >
      <Column title="To Do" tasks={[]} variant="todo" showAdd />
      <Column title="In Progress" tasks={[]} variant="in-progress" />
      <Column title="Done" tasks={[]} variant="done" />

      {/* Add Column Button */}
      <IconButton
        onClick={onAddColumn}
        sx={{
          width: 64,
          height: 'calc(100% - 3.5rem)',
          mt: 6,
          bgcolor: 'rgba(25, 27, 38, 0.3)',
          border: '2px dashed',
          borderColor: 'rgba(68, 71, 90, 0.3)',
          borderRadius: 3,
          color: 'muted',
          flexShrink: 0,
          '&:hover': {
            bgcolor: 'rgba(25, 27, 38, 0.5)',
            borderColor: 'rgba(189, 147, 249, 0.3)',
            color: 'primary.main',
          },
        }}
      >
        <ViewColumnIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};
