import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { Task } from '../types';
import { AddTaskForm } from './AddTaskForm';
import { ColumnHeader } from './ColumnHeader';
import { TaskCard } from './TaskCard';

export type ColumnProps = {
  /** Column heading text */
  title: string;
  /** Tasks to render inside the column */
  tasks: Task[];
  /** Visual variant applied to every TaskCard in this column */
  variant?: 'todo' | 'in-progress' | 'done';
  /** Show the "+" add button in the header and the AddTaskForm at the bottom */
  showAdd?: boolean;
  /** Called when the "+" header button is clicked */
  onAdd?: () => void;
  /** Drop-zone callbacks for drag-and-drop support */
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const Column = ({ title, tasks, variant = 'todo', showAdd = false, onAdd, onDragOver, onDrop }: ColumnProps) => {
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
      <ColumnHeader title={title} count={tasks.length} showAdd={showAdd} onAdd={onAdd} />

      {/* Task List */}
      <Stack
        spacing={2}
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            taskId={task.id}
            title={task.title}
            description={task.description}
            variant={variant}
          />
        ))}
        {showAdd && <AddTaskForm />}
      </Stack>
    </Box>
  );
};
