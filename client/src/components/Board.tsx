import { ColumnId, Task } from '../types';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { Column } from './Column';
import { createTask, deleteTask, getTasks, updateTask } from '../api';
import { useCallback, useEffect, useState } from 'react';

export type BoardProps = {
  /** Called when the trailing "add column" button is clicked */
  onAddColumn?: () => void;
}
// sortedColumns type
type SortedColumn = {
  id: ColumnId;
  title: string;
  tasks: Task[];
}
export const Board = ({ onAddColumn }: BoardProps) => {
  const [taskColumns, setTaskColumns] = useState<SortedColumn[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(async () => {
    try {
      const { columns, tasks } = await getTasks();
      const sortedColumns = columns.map((col) => ({
        id: col.id,
        title: col.title,
        tasks: tasks.filter((t: Task) => t.columnId === col.id),
      }));
      setTaskColumns(sortedColumns);
    } catch {
      setError('Failed to load tasks. Please refresh.');
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const handleAddTask = async (title: string, description?: string) => {
    try {
      const newTask = await createTask({
        title,
        description: description ?? '',
        columnId: ColumnId.TODO,
        order: 0,
      });
      setTaskColumns((prev) => prev.map((col) => {
        if (col.id === ColumnId.TODO) {
          return { ...col, tasks: [newTask, ...col.tasks] };
        }
        return col;
      }));
    } catch {
      setError('Failed to add task. Please try again.');
    }
  };

  const handleMoveTask = async (taskId: string, from: ColumnId, to: ColumnId) => {
    try {
      const updatedTask = await updateTask(taskId, { columnId: to });
      setTaskColumns((prev) => {
        const taskToMove = prev.find((col) => col.id === from)?.tasks.find((task) => task.id === taskId);
        if (!taskToMove) {
          return prev;
        }

        return prev.map((col) => {
          if (col.id === from) {
            return { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) };
          }
          if (col.id === to) {
            return { ...col, tasks: [updatedTask ?? { ...taskToMove, columnId: to }, ...col.tasks] };
          }
          return col;
        });
      });
    } catch {
      await loadBoard();
      setError('Failed to move task. Board was refreshed; please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTaskColumns((prev) => prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      })));
    } catch {
      setError('Failed to delete task. Please try again.');
    }
  };

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
      {
        taskColumns.map((col) => (
          <Column
            key={col.id}
            title={col.title}
            tasks={col.tasks}
            variant={col.id}
            showAdd={col.id === ColumnId.TODO ? true : false}
            onAdd={(title: string, description?: string) => handleAddTask(title, description)}
            onMove={handleMoveTask}
            onDelete={handleDeleteTask}
          />
        ))
      }
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
      <Snackbar
        open={error !== null}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};
