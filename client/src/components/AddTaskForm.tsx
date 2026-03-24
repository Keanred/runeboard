import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export type AddTaskFormProps = {
  /** Called when the form is submitted with the task title */
  onSubmit?: (title: string) => void;
  /** Called when the form is cancelled */
  onCancel?: () => void;
}

export const AddTaskForm = ({ onSubmit, onCancel }: AddTaskFormProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = () => {
    if (taskTitle.trim()) {
      onSubmit?.(taskTitle);
      setTaskTitle('');
      setFormOpen(false);
    }
  };

  const handleCancel = () => {
    setTaskTitle('');
    setFormOpen(false);
    onCancel?.();
  };

  if (!formOpen) {
    return (
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setFormOpen(true)}
        sx={{
          borderColor: 'rgba(68, 71, 90, 0.3)',
          color: 'muted',
          fontWeight: 600,
          py: 2,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.875rem',
          '&:hover': {
            bgcolor: 'rgba(189, 147, 249, 0.1)',
            borderColor: 'rgba(189, 147, 249, 0.3)',
            color: 'primary.main',
          },
        }}
      >
        Add a task
      </Button>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'surface.containerHigh',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'rgba(189, 147, 249, 0.2)',
      }}
    >
      <TextField
        autoFocus
        fullWidth
        placeholder="Enter task title..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        }}
        variant="standard"
        sx={{
          mb: 2,
          '& .MuiInput-root': {
            color: 'onSurface.main',
            fontSize: '0.875rem',
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: 'rgba(189, 147, 249, 0.2)',
          },
          '& .MuiInput-underline:hover:before': {
            borderBottomColor: 'rgba(189, 147, 249, 0.4)',
          },
        }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit}
          disabled={!taskTitle.trim()}
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 1,
          }}
        >
          Add
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={handleCancel}
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 600,
            color: 'muted',
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
