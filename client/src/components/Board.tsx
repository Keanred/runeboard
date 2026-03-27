import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { DragEvent, useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, reorderTask, updateTask } from '../api';
import { ColumnId, Task } from '../types';
import { Column } from './Column';
import { TaskInitializeModal } from './TaskInitializeModal';
import { CreateTaskInput } from '@runeboard/schemas';

export type BoardProps = {
  /** Called when the trailing "add column" button is clicked */
  onAddColumn?: () => void;
};
// sortedColumns type
type SortedColumn = {
  id: ColumnId;
  title: string;
  tasks: Task[];
};
type TaskDrag = {
  taskId: string;
  fromColumnId: ColumnId;
};

const DRAG_MIME_TYPE = 'application/x-runeboard-task';

export const Board = ({ onAddColumn }: BoardProps) => {
  const [taskColumns, setTaskColumns] = useState<SortedColumn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTaskModal, setActiveTaskModal] = useState(false);

  const loadBoard = useCallback(async () => {
    try {
      const { columns, tasks } = await getTasks();
      const sortedColumns = columns.map((col) => ({
        id: col.id,
        title: col.title,
        tasks: tasks.filter((t: Task) => t.columnId === col.id),
      }));
      setTaskColumns(sortedColumns);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks. Please refresh.');
    }
  }, []);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

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
    } catch (e) {
      await loadBoard();
      setError(e instanceof Error ? e.message : 'Failed to move task. Board was refreshed; please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTaskColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete task. Please try again.');
    }
  };

  const onSubmitNewTask = async (task: CreateTaskInput) => {
    try {
      const result = await createTask(task);
      setTaskColumns((prev) =>
        prev.map((col) => {
          if (col.id === result.columnId) {
            return { ...col, tasks: [result, ...col.tasks] };
          }
          return col;
        }),
      );
    setActiveTaskModal(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create task. Please try again.');
    }
  }

  const handleReorder = useCallback(
    async (taskId: string, fromColumnId: ColumnId, toColumnId: ColumnId, visualToIndex: number) => {
      const sourceCol = taskColumns.find((c) => c.id === fromColumnId);
      const currentIndex = sourceCol?.tasks.findIndex((t) => t.id === taskId) ?? -1;

      // Same-column no-op: dropping on the same slot or the adjacent one (net position unchanged)
      if (
        fromColumnId === toColumnId &&
        (visualToIndex === currentIndex || visualToIndex === currentIndex + 1)
      ) {
        return;
      }

      // Translate visual index → server index (after removing the task from source)
      const serverToIndex =
        fromColumnId === toColumnId && visualToIndex > currentIndex
          ? visualToIndex - 1
          : visualToIndex;

      // Optimistic update
      setTaskColumns((prev) => {
        const task = prev.find((c) => c.id === fromColumnId)?.tasks.find((t) => t.id === taskId);
        if (!task) return prev;

        const withoutTask = prev.map((col) =>
          col.id === fromColumnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col,
        );
        return withoutTask.map((col) => {
          if (col.id !== toColumnId) return col;
          const newTasks = [...col.tasks];
          newTasks.splice(Math.min(serverToIndex, newTasks.length), 0, { ...task, columnId: toColumnId });
          return { ...col, tasks: newTasks };
        });
      });

      try {
        await reorderTask(taskId, serverToIndex, fromColumnId !== toColumnId ? toColumnId : undefined);
      } catch (e) {
        await loadBoard();
        setError(e instanceof Error ? e.message : 'Failed to reorder task. Board was refreshed; please try again.');
      }
    },
    [taskColumns, loadBoard],
  );

  const dragHandler = (taskId: string, fromColumnId: ColumnId, e: DragEvent) => {
    const payload: TaskDrag = { taskId, fromColumnId };
    e.dataTransfer.setData(DRAG_MIME_TYPE, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropToColumn = async (toColumnId: ColumnId, e: DragEvent, toIndex: number) => {
    const raw = e.dataTransfer.getData(DRAG_MIME_TYPE);
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as TaskDrag;
      if (!payload.taskId) return;
      void handleReorder(payload.taskId, payload.fromColumnId, toColumnId, toIndex);
    } catch {
      await loadBoard();
      setError('Invalid drag data. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 4,
        minWidth: 'max-content',
        p: 5,
      }}
    >
      <TaskInitializeModal open={activeTaskModal} onClose={() => setActiveTaskModal(false)} onSubmit={onSubmitNewTask} />
      {taskColumns.map((col) => (
        <Column
          key={col.id}
          title={col.title}
          tasks={col.tasks}
          variant={col.id}
          showAdd={col.id === ColumnId.TODO ? true : false}
          onDragStart={dragHandler}
          onDrop={(e, toIndex) => handleDropToColumn(col.id, e, toIndex)}
          onMove={handleMoveTask}
          onDelete={handleDeleteTask}
          onOpenTaskModal={() => setActiveTaskModal(true)}
        />
      ))}
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
