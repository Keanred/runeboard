import { v4 as UUID } from 'uuid';
import { ColumnId, TaskData } from './types';

const todoColumn: Map<string, TaskData> = new Map();
const inProgressColumn: Map<string, TaskData> = new Map();
const doneColumn: Map<string, TaskData> = new Map();

const store = {
  [ColumnId.TODO]: todoColumn,
  [ColumnId.IN_PROGRESS]: inProgressColumn,
  [ColumnId.DONE]: doneColumn,
};

export const insertTask = (task: TaskData) => {
  const createdTask = {
    ...task,
    id: UUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store[task.columnId].set(createdTask.id, createdTask);
};

export const updateTask = (task: TaskData) => {
  const existingTask = store[task.columnId].get(task.id);
  if (!existingTask) {
    throw new Error('Task not found');
  }
  const updatedTask = {
    ...existingTask,
    ...task,
    updatedAt: new Date().toISOString(),
  };
  store[task.columnId].set(task.id, updatedTask);
};

export const deleteTask = (taskId: string, columnId: ColumnId) => {
  store[columnId].delete(taskId);
};

export const getTasksByColumn = (columnId: ColumnId): TaskData[] => {
  return Array.from(store[columnId].values());
};

const seedTasks: Omit<TaskData, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Design database schema',
    description: 'Define tables and relationships for the production DB.',
    columnId: ColumnId.TODO,
    order: 0,
  },
  {
    title: 'Write API integration tests',
    description: 'Cover all task CRUD endpoints with integration tests.',
    columnId: ColumnId.TODO,
    order: 1,
  },
  {
    title: 'Implement drag-and-drop',
    description: 'Allow tasks to be reordered and moved between columns.',
    columnId: ColumnId.IN_PROGRESS,
    order: 0,
  },
  {
    title: 'Set up CI pipeline',
    description: 'Configure GitHub Actions to run lint, typecheck, and tests on every PR.',
    columnId: ColumnId.IN_PROGRESS,
    order: 1,
  },
  {
    title: 'Initialise monorepo',
    description: 'Create client and server workspaces with shared root package.json.',
    columnId: ColumnId.DONE,
    order: 0,
  },
];

seedTasks.forEach((task) => insertTask({ ...task, id: '', createdAt: '', updatedAt: '' }));
