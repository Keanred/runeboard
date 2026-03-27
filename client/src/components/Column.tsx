import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DragEvent, useState } from 'react';
import { ColumnId, Task } from '../types';
import { ColumnHeader } from './ColumnHeader';
import { TaskCard } from './TaskCard';
import { TaskInitializeModalTrigger } from './TaskInitializeModal';

export type ColumnProps = {
  /** Column heading text */
  title: string;
  /** Tasks to render inside the column */
  tasks: Task[];
  /** Visual variant applied to every TaskCard in this column */
  variant?: ColumnId;
  /** Show the add-task trigger at the bottom of the column */
  showAdd?: boolean;
  onMove?: (taskId: string, from: ColumnId, to: ColumnId) => void;
  onDelete?: (taskId: string) => void;
  /** Drop-zone callbacks for drag-and-drop support */
  onDragStart?: (taskId: string, fromColumnId: ColumnId, e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onOpenTaskModal?: () => void;
};

export const Column = ({
  title,
  tasks,
  variant = ColumnId.TODO,
  showAdd = false,
  onMove,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onOpenTaskModal,
}: ColumnProps) => {
  const [dragOver, setDragOver] = useState(false);

  const getNextColumnId = (currentColumnId: ColumnId): ColumnId => {
    const stateTransitions: Record<string, ColumnId> = {
      [ColumnId.TODO]: ColumnId.IN_PROGRESS,
      [ColumnId.IN_PROGRESS]: ColumnId.DONE,
      [ColumnId.DONE]: ColumnId.TODO,
    };
    return stateTransitions[currentColumnId] ?? currentColumnId;
  };

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
        borderRadius: 3,
        transition: 'outline 0.2s',
        outline: dragOver ? '2px dashed' : '2px dashed transparent',
        outlineColor: dragOver ? 'primary.main' : 'transparent',
        outlineOffset: 4,
      }}
    >
      <ColumnHeader title={title} count={tasks.length} showAdd={showAdd} />

      {/* Task List */}
      <Stack
        spacing={2}
        sx={{
          pr: 1,
          '& > *': {
            flexShrink: 0,
          },
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            taskId={task.id}
            title={task.title}
            description={task.description}
            variant={variant}
            onMove={onMove ? () => onMove(task.id, task.columnId, getNextColumnId(task.columnId)) : undefined}
            onDelete={onDelete}
            onDragStart={onDragStart ? (e) => onDragStart(task.id, task.columnId, e) : undefined}
          />
        ))}
        {showAdd && <TaskInitializeModalTrigger onClick={onOpenTaskModal} />}
      </Stack>
    </Box>
  );
};
